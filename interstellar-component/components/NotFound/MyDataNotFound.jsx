import React from 'react'
import { SearchLg } from '@untitled-ui/icons-react'
import MyBgPatternDecorativeCircle from '../Decorative/MyBgPatternDecorativeCircle'

function MyDataNotFound({ isSearch }) {
  return (
    <>
      {isSearch ? (
        <div className="flex w-full max-w-[375px] flex-col items-center gap-2.5">
          <div>
            <MyBgPatternDecorativeCircle>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-light/200 text-gray-light/700">
                <SearchLg size={28} stroke="currentColor" />
              </div>
            </MyBgPatternDecorativeCircle>
          </div>
          <div className="z-20 flex flex-col gap-2 text-center">
            <p className="text-xl-semibold text-gray-light/900">
              {isSearch ? ' Data tidak ditemukan' : ' Cari'}
            </p>
            <p className="text-md-regular text-gray-light/600">
              {isSearch
                ? ' Tidak ada data yang cocok untuk pencarian anda. harap coba lagi.'
                : 'Silahkan cari data yang anda inginkan.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-[375px] flex-col items-center gap-2.5">
          <div>
            <MyBgPatternDecorativeCircle>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-light/200 text-gray-light/700">
                <SearchLg size={28} stroke="currentColor" />
              </div>
            </MyBgPatternDecorativeCircle>
          </div>
          <div className="z-20 flex flex-col gap-2 text-center">
            <p className="text-xl-semibold text-gray-light/900">
              Please search
            </p>
            <p className="text-sm-regular text-gray-light/600">
              Please perform a search. You can search directly through the
              terminal serial number or via the merchant.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default MyDataNotFound
