import {
  MyButton,
  MyTextField,
  MyAutocomplete,
  MyDropzone,
  MyTextArea
} from '@interstellar-component'
import { ArrowLeft } from '@untitled-ui/icons-react'

function StepCompanyInfo({ control, errors, trigger, watch, setValue, isSubmitting }) {
  const {
    company_name,
    business_category,
    industry,
    company_size,
    website,
    email,
    province,
    city,
    district,
    subdistrict,
    postal_code,
    company_address
  } = watch()

  return (
    <div className="flex flex-col w-full max-w-[1000px] mx-auto py-8 pb-12 gap-8">
      {/* Header section */}
      <div className="flex flex-col gap-6 w-full border-b border-gray-200 pb-6">
        <div className="px-8 w-full flex flex-col gap-5">
          <button className="flex items-center gap-1.5 text-brand-700 hover:text-brand-800 font-semibold text-sm w-fit transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-700" /> Back to company menu
          </button>
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-display-xs-semibold text-gray-900">Company Information</h1>
            <p className="text-md-regular text-gray-600">
              Provide basic information about your company to set up your account.
            </p>
          </div>
        </div>
      </div>

      {/* Section */}
      <div className="flex flex-col gap-8 w-full">
        <div className="px-8 w-full flex flex-col gap-6">
          
          {/* Form Area 1: Company Details */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full md:w-[280px] shrink-0 flex flex-col">
              <h2 className="text-sm-semibold text-gray-900">Company Details</h2>
              <p className="text-sm-regular text-gray-600">Basic information about your company.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 max-w-[624px] rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(10,13,18,0.05)] bg-white flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Legal name
                  </label>
                  <MyTextField
                    name="company_name"
                    trigger={trigger}
                    placeholder="e.g. PT Everest Maju Sejahtera"
                    control={control}
                    value={company_name}
                    errors={errors?.company_name?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Business category
                  </label>
                  <MyAutocomplete
                    name="business_category"
                    options={[
                      { label: 'Technology', value: 'technology' },
                      { label: 'Finance', value: 'finance' },
                    ]}
                    trigger={trigger}
                    placeholder="Select type"
                    control={control}
                    value={business_category}
                    errors={errors?.business_category?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Industry
                  </label>
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Number of employee
                  </label>
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
                    placeholder="Select range"
                    control={control}
                    value={company_size}
                    errors={errors?.company_size?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">
                    Company Website
                  </label>
                  <MyTextField
                    name="website"
                    trigger={trigger}
                    placeholder="e.g. www.everest.com"
                    control={control}
                    value={website}
                    errors={errors?.website?.message}
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Email address
                  </label>
                  <MyTextField
                    name="email"
                    trigger={trigger}
                    placeholder="e.g. olivia@everest.com"
                    control={control}
                    value={email}
                    errors={errors?.email?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Logo
                  </label>
                  <MyDropzone
                    colorBg="bg-white"
                    multiple={false}
                    accept={['.png', '.jpg', '.jpeg', '.svg', '.gif']}
                    maxSize={5242880} // 5MB
                    showImage
                    onChange={(files) => {
                      setValue('logo', files && files.length > 0 ? files[0] : null, {
                        shouldDirty: true,
                      })
                    }}
                    errors={errors?.logo?.message}
                  />
                </div>

              </div>
            </div>
          </div>
        
          <hr className="w-full border-gray-200" />
          
          {/* Form Area 2: Company Address */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full md:w-[280px] shrink-0 flex flex-col">
              <h2 className="text-sm-semibold text-gray-900">Company Address</h2>
              <p className="text-sm-regular text-gray-600">Location details of your registered company address.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 max-w-[624px] rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(10,13,18,0.05)] bg-white flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Province
                  </label>
                  <MyAutocomplete
                    name="province"
                    options={[]} // Add real options when integrating with API
                    trigger={trigger}
                    placeholder="Select Province"
                    control={control}
                    value={province}
                    errors={errors?.province?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    City / Kabupaten
                  </label>
                  <MyAutocomplete
                    name="city"
                    options={[]} // Add real options when integrating with API
                    trigger={trigger}
                    placeholder="Select City / Kabupaten"
                    control={control}
                    value={city}
                    errors={errors?.city?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    District
                  </label>
                  <MyAutocomplete
                    name="district"
                    options={[]} // Add real options when integrating with API
                    trigger={trigger}
                    placeholder="Select District"
                    control={control}
                    value={district}
                    errors={errors?.district?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Subdistrict
                  </label>
                  <MyAutocomplete
                    name="subdistrict"
                    options={[]} // Add real options when integrating with API
                    trigger={trigger}
                    placeholder="Select Subdistrict"
                    control={control}
                    value={subdistrict}
                    errors={errors?.subdistrict?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Postal Code
                  </label>
                  <MyAutocomplete
                    name="postal_code"
                    options={[]} // Add real options when integrating with API
                    trigger={trigger}
                    placeholder="Select Postal Code"
                    control={control}
                    value={postal_code}
                    errors={errors?.postal_code?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                    Company Address
                  </label>
                  <MyTextArea
                    name="company_address"
                    trigger={trigger}
                    placeholder="e.g. Kawasan Rasuna Epicentrum, JL. HR. Rasuna Said"
                    control={control}
                    value={company_address}
                    errors={errors?.company_address?.message}
                    rows={4}
                  />
                  <p className="text-sm-regular text-gray-500 mt-1">275 characters left</p>
                </div>

              </div>
            </div>
          </div>

        </div>
        
        <div className="px-8 w-full">
           <hr className="w-full border-gray-200 mb-5" />
           <div className="flex justify-end w-full gap-3">
             <MyButton 
               variant="outlined" 
               color="secondary"
               type="button"
               disabled={isSubmitting}
             >
               <span className="text-sm-semibold">Cancel & save draft</span>
             </MyButton>
             <MyButton 
               variant="filled" 
               color="primary"
               type="submit"
               disabled={isSubmitting}
             >
               <span className="text-sm-semibold text-white">Next</span>
             </MyButton>
           </div>
        </div>

      </div>
    </div>
  )
}

export default StepCompanyInfo
