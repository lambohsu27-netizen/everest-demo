import React, { useMemo } from 'react'
import SimpleBar from 'simplebar-react'
import { XClose } from '@untitled-ui/icons-react'
import { 
  MyDoubleCard, 
  MyDetailView, 
  MyChip, 
  MyBgPatternDecorativeCircle,
  MySkeuomorphicContainer
} from '@interstellar-component'
import MyChartLine from '@interstellar-component/components/Chart/MyChartLine'
import { useWorkforce } from '../Context'

/**
 * LoanAccountSlider component
 * 
 * Provides a high-fidelity detailed view of a specific loan account.
 * Portrayed in Figma as the "BCA Master Card" detail modal.
 */
function LoanAccountSlider() {
  const { sliderStack, popSlider } = useWorkforce()
  
  // Get the data for the current active slider (the top of the stack)
  const activeSlider = useMemo(
    () => (sliderStack.length > 0 ? sliderStack[sliderStack.length - 1] : null),
    [sliderStack]
  )

  const accountData = activeSlider?.data || {}
  const accountName = accountData.name || 'Account Detail'
  const bankName = accountData.bank || 'BCA'

  // Mock data for the Information section
  const informationData = {
    'Collectibility status': <MyChip label="Kol 1" color="error" variant="filled" size="sm" rounded="full" />,
    'Limit': 'Rp5,000,000',
    'Outstanding': 'Rp5,000,000',
    'Available': '-',
    'Credit type': 'Kartu kredit',
    'Start date': '12 Des 2024',
    'Account aging': '10 bulan',
    'Account expired': 'Jan 2026',
  }

  // Mock data for Collectibility History chart
  const chartSeries = [
    { name: 'Kol Status', data: [4, 4, 5, 5, 5, 5, 5, 5] }
  ]
  const chartLabels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  
  const chartOptions = {
    yaxis: {
      min: 1,
      max: 5,
      reversed: true,
      labels: {
        style: { colors: '#717680', fontSize: '12px' }
      }
    },
    colors: ['#42307D'],
    stroke: { curve: 'straight', width: 2 },
    markers: { size: 4 },
  }

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative px-6 py-8 border-b border-gray/100">
        <button
          type="button"
          onClick={popSlider}
          className="absolute right-[16px] top-[16px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray/400 hover:bg-gray/50"
        >
          <XClose size={24} />
        </button>

        {/* Decorative background pattern */}
        <div className="absolute left-0 top-0 -z-10 opacity-20">
            <MyBgPatternDecorativeCircle size="sm" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <MySkeuomorphicContainer className="size-14 flex items-center justify-center bg-white border border-gray/200 rounded-xl shadow-xs">
              <span className="text-xl-bold text-[#0060AF]">{bankName}</span>
            </MySkeuomorphicContainer>
            
            <div className="flex flex-col gap-1">
              <h3 className="text-lg-semibold text-gray/900">{accountName}</h3>
              <p className="text-sm-regular text-gray/600">Data as 02 Oct 2025</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex items-center gap-2 rounded-full border border-gray/200 bg-gray/50 px-3 py-1">
              <span className="text-xs-medium text-gray/600">Loan ID</span>
              <span className="text-xs-semibold text-gray/900">1122334455</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-4 py-6">
            
            {/* Information Section */}
            <MyDoubleCard heading="Information" innerClassName="p-0">
               <MyDetailView datas={informationData} />
            </MyDoubleCard>

            {/* Payment History Section (Simplified Grid) */}
            <MyDoubleCard heading="Payment history" innerClassName="p-4">
               <div className="flex flex-col gap-4">
                 <div className="flex justify-between border-b border-gray/100 pb-3">
                    <span className="text-sm text-gray/600">Perform</span>
                    <span className="text-sm-semibold text-gray/900">3 times</span>
                 </div>
                 <div className="flex justify-between border-b border-gray/100 pb-3">
                    <span className="text-sm text-gray/600">Non-perform</span>
                    <span className="text-sm-semibold text-gray/900">7 times</span>
                 </div>
                 <div className="flex justify-between pb-1">
                    <span className="text-sm text-gray/600">Last update</span>
                    <span className="text-sm-semibold text-gray/900">10 Nov 2025</span>
                 </div>
                 
                 {/* Dot Grid Placeholder logic - for brief demo */}
                 <div className="bg-gray/25 rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex justify-between px-2 text-[10px] text-gray/400">
                      <span>J</span><span>F</span><span>M</span><span>A</span><span>M</span><span>J</span><span>J</span><span>A</span><span>S</span><span>O</span><span>N</span><span>D</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[10px] text-gray/500 w-6">2024</span>
                      <div className="flex-1 flex justify-between">
                        {[...Array(11)].map((_, i) => <div key={i} className="size-2 rounded-full bg-gray/200" />)}
                        <div className="size-2 rounded-full bg-primary/200 border border-primary/400" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[10px] text-gray/500 w-6">2025</span>
                      <div className="flex-1 flex justify-between">
                         <div className="size-2 rounded-full bg-primary/400" />
                         <div className="size-2 rounded-full bg-primary/400" />
                         {[...Array(7)].map((_, i) => <div key={i} className="size-2 rounded-full bg-error/400" />)}
                         {[...Array(3)].map((_, i) => <div key={i} className="size-2 rounded-full bg-gray/200" />)}
                      </div>
                    </div>
                 </div>
               </div>
            </MyDoubleCard>

            {/* Collectibility History Section */}
            <MyDoubleCard heading="Collectibility history" innerClassName="p-4">
               <div className="h-[200px] w-full">
                  <MyChartLine 
                    series={chartSeries} 
                    categories={chartLabels}
                    options={chartOptions}
                  />
               </div>
            </MyDoubleCard>

          </div>
        </SimpleBar>
      </div>
    </div>
  )
}

export default LoanAccountSlider
