import React from 'react'
import Posters from './Posters'

interface Props {
  contentList?: any
  type: string
}

function Carousel({ contentList, type }: Props) {
  const items = Array.isArray(contentList) ? contentList : []
  const tmdbPosterLink = `https://image.tmdb.org/t/p/w500/`

  return (
    <>
      <div className="carousel-container relative overflow-x-auto no-scrollbar">
        <div className="carousel-wrapper flex gap-4">
          {/* <div className="flex justify-center">
      <div className="flex flex-wrap gap-4"> */}
          {items.map((movie) => (
            <div key={movie.id} className="poster flex-none">
              <Posters
                type={type}
                content={movie}
                tmdbPosterLink={tmdbPosterLink}
              />
            </div>
          ))}
        </div>
      </div>
      {/* <div className="indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"></div> */}
    </>
  )
}

export default Carousel
