import { Link } from '@mui/material'
import {
  BlobProvider,
  Document,
  Image,
  Page,
  Text,
  View,
} from '@react-pdf/renderer'

export default function MyImageToPdf({
  children,
  isDownloaded = false,
  fileName = '',
  srcImages = [],
  ...props
}) {
  // console.log('src images: ', srcImages)

  return (
    <BlobProvider document={<PdfDocument srcImages={srcImages} />}>
      {({ url }) => (
        <Link
          href={url}
          download={isDownloaded ? fileName : null}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </Link>
      )}
    </BlobProvider>
  )
}

function PdfDocument({ srcImages = [] }) {
  // console.log('src images: ', srcImages)

  return (
    <Document>
      {srcImages.map((src) => (
        <Page key={src} size="A4" style={{ padding: '1cm' }}>
          <View
            style={{
              position: 'absolute',
              height: '1px',
              right: '1cm',
              left: '1cm',
              top: '1cm',
              backgroundColor: 'black',
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: '1px',
              right: '1cm',
              left: '1cm',
              bottom: '1cm',
              backgroundColor: 'black',
            }}
          />
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            style={{
              fontSize: '0.3cm',
              position: 'absolute',
              bottom: '0.5cm',
              right: '1.5cm',
            }}
          />
          <Image src={src} style={{ maxHeight: '90%' }} />
        </Page>
      ))}
    </Document>
  )
}
