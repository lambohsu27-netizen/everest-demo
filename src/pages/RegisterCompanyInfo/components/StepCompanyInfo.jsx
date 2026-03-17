import { MyButton, MyTextField, MyBgPatternDecorativeCube, MyLogo, MyAutocomplete } from '@interstellar-component'

function StepCompanyInfo({ control, errors, trigger, watch, isSubmitting }) {
  const { company_name, industry, website, company_size } = watch()

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="items-center justify-center gap-6 w-full max-w-[480px] rounded-xl p-5 md:p-10 column z-50">
        <div className="z-0">
          <MyBgPatternDecorativeCube />
        </div>
        <div className="z-40 flex flex-col gap-6 items-center">
          <MyLogo />
        </div>

        <div className="z-40 flex flex-col gap-6 items-center">
          <div className="gap-y-2 column items-center text-center">
            <p className="display-sm-semibold text-gray-900">Company Information</p>
            <p className="text-md-regular text-gray-600">
              Provide basic information about your company to set up your account
            </p>
          </div>
        </div>

        <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Company Name</p>
            <MyTextField
              name="company_name"
              trigger={trigger}
              placeholder="Enter company name"
              control={control}
              value={company_name}
              errors={errors?.company_name?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Industry</p>
            <MyAutocomplete
              name="industry"
              options={[
                { label: 'Technology', value: 'technology' },
                { label: 'Finance', value: 'finance' },
                { label: 'Healthcare', value: 'healthcare' },
                { label: 'Education', value: 'education' },
                { label: 'Other', value: 'other' },
              ]}
              trigger={trigger}
              placeholder="Select industry"
              control={control}
              value={industry}
              errors={errors?.industry?.message}
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Website</p>
            <MyTextField
              name="website"
              trigger={trigger}
              placeholder="e.g. www.company.com"
              control={control}
              value={website}
              errors={errors?.website?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Company Size</p>
            <MyAutocomplete
              name="company_size"
              options={[
                { label: '1-10 employees', value: '1-10' },
                { label: '11-50 employees', value: '11-50' },
                { label: '51-200 employees', value: '51-200' },
                { label: '201-500 employees', value: '201-500' },
                { label: '500+ employees', value: '500+' },
              ]}
              trigger={trigger}
              placeholder="Select company size"
              control={control}
              value={company_size}
              errors={errors?.company_size?.message}
            />
          </div>

          <div className="z-40 relative w-full space-y-4 mt-6">
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              disabled={isSubmitting}
            >
              <p className="text-md-semibold">Continue</p>
            </MyButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepCompanyInfo
