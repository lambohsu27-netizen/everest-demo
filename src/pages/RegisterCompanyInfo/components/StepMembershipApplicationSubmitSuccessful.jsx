import { MyButton, MyBgPatternDecorativeCube, MyFeaturedIcon } from '@interstellar-component'

function StepMembershipApplicationSubmitSuccessful({ onBackToCompanyList }) {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-8 w-full max-w-[360px] z-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] -z-10 pointer-events-none">
          <MyBgPatternDecorativeCube />
        </div>

        <div className="flex flex-col gap-6 items-center w-full">
          <MyFeaturedIcon icon="CheckVerified03" color="Gray" size="xl" />

          <div className="flex flex-col gap-3 items-center text-center">
            <h1 className="text-[30px] font-semibold text-gray-900 leading-[38px] tracking-tight">
              Membership Application
              <br />
              Submitted Successfully
            </h1>
            <p className="text-base text-gray-600 leading-normal">
              Your application is currently being reviewed by CLIK. You will be notified once the
              review is complete.
            </p>
          </div>
        </div>

        <div className="w-full mt-2">
          <MyButton
            type="button"
            color="primary"
            variant="filled"
            size="lg"
            expanded
            onClick={onBackToCompanyList}
          >
            <span className="text-base font-semibold">Back to List of Company</span>
          </MyButton>
        </div>
      </div>
    </section>
  )
}

export default StepMembershipApplicationSubmitSuccessful
