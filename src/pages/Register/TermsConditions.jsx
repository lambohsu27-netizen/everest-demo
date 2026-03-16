import { MyButton, MyCheckbox } from '@interstellar-component'
import { ArrowLeft } from '@untitled-ui/icons-react'
import React from 'react'

function TermsConditions({ onBack, onAccept, accepted, setAccepted }) {
  const sections = [
    {
      heading: 'Lorem ipsum delarus?',
      content:
        'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.\nEget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.',
    },
    {
      heading: 'What information do we collect?',
      content:
        'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.\nElit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.\nIpsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.',
    },
    {
      heading: 'How do we use your information?',
      content:
        'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.\nElit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.\nIpsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.',
    },
    {
      heading: 'Do we use cookies and other tracking technologies?',
      content:
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
    },
    {
      heading: 'How long do we keep your information?',
      content:
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
    },
    {
      heading: 'How do we keep your information safe?',
      content:
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
    },
    {
      heading: 'What are your privacy rights?',
      content:
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
    },
    {
      heading: 'How can you contact us about this policy?',
      content:
        'Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida id. Sed quis auctor vulputate hac elementum gravida cursus dis.\nLectus id duis vitae porttitor enim gravida morbi.\nEu turpis posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.\nSuspendisse maecenas ac donec scelerisque diam sed est duis purus.',
    },
  ]

  return (
    <div className="flex flex-col w-full max-w-[1000px] h-full overflow-y-auto px-16 pt-24 pb-16 gap-12 scrollbar-hide bg-white">
      <div className="flex flex-col gap-6">
        <MyButton
          variant="link"
          color="primary"
          onClick={onBack}
          className="w-fit p-0 h-fit !text-primary-700"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft size={20} />
            <p className="text-sm-semibold">Back to previous page</p>
          </div>
        </MyButton>

        <div className="flex flex-col gap-1 border-b border-gray-200 pb-5">
          <p className="display-sm-semibold text-gray-900">Terms and conditions</p>
          <p className="text-sm-regular text-gray-600">Current as of 20 Jan 2025</p>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-4">
              <p className="text-lg-semibold text-gray-900">{section.heading}</p>
              <div className="text-md-regular text-gray-600 whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-gray-200 pt-8 pb-12">
          <div className="flex items-start gap-3">
            <MyCheckbox
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <p className="text-sm-regular text-gray-900">
              Dengan menyetujui ini, Anda menyatakan telah membaca dan menyetujui syarat & ketentuan yang berlaku.
            </p>
          </div>

          <MyButton
            variant="filled"
            color="primary"
            size="lg"
            expanded
            disabled={!accepted}
            onClick={onAccept}
          >
            <p className="text-md-semibold">Kirim pengajuan</p>
          </MyButton>
        </div>
      </div>
    </div>
  )
}

export default TermsConditions
