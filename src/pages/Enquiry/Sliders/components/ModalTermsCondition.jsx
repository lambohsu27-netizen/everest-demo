import { AlertCircle, XClose } from '@untitled-ui/icons-react'
import { MyBgPatternDecorativeCircle, MyButton, MyModal } from '@interstellar-component'

function ModalTermsCondition({ open, onClose }) {
  return (
    <MyModal
      open={open}
      children={<ModalTermsConditionView onClose={onClose} />}
      onClose={onClose}
      forceBlur
    />
  )
}

export default ModalTermsCondition

function ModalTermsConditionView({ onClose }) {
  return (
    <div className="flex w-[calc(100vw-32px)] md:w-[800px] max-w-[90vw] flex-col gap-5 overflow-hidden rounded-xl bg-base-white">
      <header className="relative flex items-start gap-x-4 pt-6">
        <button
          onClick={onClose}
          className="absolute right-[12px] top-[12px] z-10 flex h-11 w-11 items-center justify-center rounded-lg p-2 hover:bg-gray-50"
        >
          <XClose size={24} className="text-gray-400" stroke="currentColor" />
        </button>
        <div className="flex w-full flex-col gap-4 px-6 md:px-8">
          <div className="z-0">
            <MyBgPatternDecorativeCircle
              children={
                <div className="w-fit rounded-full border-8 border-brand/50 bg-brand/100 p-3">
                  <AlertCircle className="text-brand/900" />
                </div>
              }
            />
          </div>
          <div className="z-40 flex flex-col gap-4">
            <p className="text-lg-semibold text-gray-900 mt-2">Terms & Conditions</p>
            <ol className="list-decimal pl-4 text-sm-regular text-gray-600 flex flex-col gap-2">
              <li className="pl-1">
                Laporan Kredit yang diberikan hanya dapat digunakan untuk kepentingan sebagaimana
                yang dijelaskan dalam Formulir Permohonan ini.
              </li>
              <li className="pl-1">
                Sesuai dengan POJK 05 / 2022, Debitur atau Nasabah dapat memperoleh Informasi
                Perkreditan tanpa dikenakan biaya sebanyak 1 (satu) kali dalam kurun waktu 12 (dua
                belas) bulan, untuk permohonan berikutnya PT CLIK akan mengenakan biaya Rp
                150,000.00..
              </li>
              <li className="pl-1">
                Payment by transfer to the account below:
                <br />
                Bank : PT. Bank Mandiri (Persero) Tbk
                <br />
                Branch : Graha Irama
                <br />
                On behalf of : PT. Crif Lembaga Informasi Keuangan
                <br />
                Acc. No : 124-000-783-8486
              </li>
              <li className="pl-1">
                PT CLIK selaku pengelola data tidak bertanggung jawab terhadap kebenaran dan
                keakuratan informasi yang terdapat dalam Laporan.
              </li>
              <li className="pl-1">
                Segala akibat hukum yang timbul sehubungan dengan pemberian dan penggunaan Laporan
                sepenuhnya merupakan tanggung jawab Pemohon dan PT CLIK dibebaskan dari segala
                tuntutan.
              </li>
            </ol>
          </div>
        </div>
      </header>
      <div className="z-40 flex px-6 md:px-8 pb-8 pt-4">
        <MyButton
          expanded
          color="primary"
          variant="filled"
          size="lg"
          onClick={onClose}
          type="button"
        >
          <p className="text-sm-semibold">Close</p>
        </MyButton>
      </div>
    </div>
  )
}
