import { XClose, ChevronLeft, ChevronRight } from '@untitled-ui/icons-react'
import React, { useRef, useState, useEffect } from 'react'
import SimpleBar from 'simplebar-react'
import { useUser } from '../Context'

const DetailSliderEnroll = (nasabahDetails) => {
  const { handleCurrentSlider } = useUser()

  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Function to check scroll position and update button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 100)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding errors
    }
  }

  // Run on mount and when scrolling
  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])

  // Function to scroll left
  const handleScrollLeft = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -160,
        behavior: 'smooth',
      })
    }
  }

  // Function to scroll right
  const handleScrollRight = () => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: 160,
        behavior: 'smooth',
      })
    }
  }

  // Prevent scrollwheel scrolling
  const handleWheel = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <header className="relative flex items-start gap-x-4 px-6 pt-8">
        <button className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-xl p-2 text-gray-light-400">
          <XClose
            className="size-5"
            onClick={() => {
              handleCurrentSlider(null)
            }}
          />
        </button>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <div>
                <p className="text-xl-bold text-gray-light-900">{'Enroll'}</p>
                <p className="text-md text-gray-light-900">
                  {'8 Jan 2025 • 12:35:27'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SimpleBar forceVisible="y" style={{ height: 'calc(100vh - 100px)' }}>
        <main className="pt-8 column">
          <section className="gap-4 column">
            <p className="text-sm-semibold px-6 text-brand-700">Foto nasabah</p>
            <div className="pl-6">
              {/* Scrollable container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-hidden pl-6"
                style={{
                  scrollBehavior: 'smooth',
                  scrollSnapType: 'x mandatory',
                }}
                onWheel={handleWheel}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 snap-start justify-center gap-[6px] column"
                  >
                    <p className="text-sm-medium text-gray-700">
                      {index % 2 === 0 ? 'Tampak depan' : 'Tampak serong kanan'}
                    </p>
                    <img
                      className="rounded-xl"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvAObmdkzGx1YQLnYeYOsHyNP33Zr_3VcsZQ&s"
                      alt={`Image ${index}`}
                      style={{
                        width: '160px',
                        height: '176px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleScrollLeft}
                  disabled={!canScrollLeft}
                  className={`rounded-full p-3 shadow-md ${
                    !canScrollLeft
                      ? 'cursor-not-allowed bg-gray-200'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft
                    className={`size-5 ${
                      !canScrollLeft ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  />
                </button>
                <button
                  onClick={handleScrollRight}
                  disabled={!canScrollRight}
                  className={`rounded-full p-3 shadow-md ${
                    !canScrollRight
                      ? 'cursor-not-allowed bg-gray-200'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight
                    className={`size-5 ${
                      !canScrollRight ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  />
                </button>
              </div>

              <hr className="my-6 max-w-[325px]" />
            </div>
          </section>

          <section className="px-6">
            <p className="text-sm-semibold mb-4 text-brand-700">
              Foto KTP nasabah
            </p>
            <img
              className="rounded-xl"
              src="https://lh3.googleusercontent.com/ehiG9Usj1GuEZcMX4pRj3Gs1z-L8TbOY7HHmSfT_1MrvsrgvD6GSQjLV5a0XryW86h2NeAoXNyMQfuHsWN4txULvnCwHCLOyAQnXNwOXuFDC1aJzvaoONqrwLHFRgEZclfAzR7O_azSUCh6bjG9B-6aZPuszfVNpq0iurE3H8ah9bVbBQvUzSepnOpGGKngVXlOqGnACJw"
              alt="ktp"
              style={{ width: '352px', height: '176px', objectFit: 'cover' }}
            />
            <hr className="my-6" />
          </section>

          <section className="px-6 column">
            <p className="text-sm-semibold mb-4 text-brand-700">Hasil enroll</p>
            <div>a</div>
            <div>a</div>
            <div>a</div>

            <hr className="my-6" />
          </section>

          <section className="px-6 column">
            <p className="text-sm-semibold mb-4 text-brand-700">
              Informasi lainnya
            </p>
            <div>a</div>
            <div>a</div>
            <div>a</div>
          </section>
        </main>
      </SimpleBar>
    </div>
  )
}

export default DetailSliderEnroll
