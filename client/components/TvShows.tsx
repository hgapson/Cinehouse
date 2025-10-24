import React from 'react'
import Carousel from './Carousel'

interface Props {
  shows?: any
}

function TvShows({ shows }: Props) {
  const popularShows = shows?.popular?.results ?? []
  const trendingShows = shows?.trending?.results ?? []
  const topRatedShows = shows?.topRated?.results ?? []
  const comedy = shows?.comedy?.results ?? []
  const reality = shows?.action?.results ?? []

  return (
    <div>
      <div>
        <p className="text-white">Top Rated Shows</p>
        <Carousel type={'show'} contentList={topRatedShows} />
        <p className="text-white">Popular Shows</p>
        <Carousel type={'show'} contentList={popularShows} />
        <p className="text-white">Trending Shows</p>
        <Carousel type={'show'} contentList={trendingShows} />
        <p className="text-white">Comedy</p>
        <Carousel type={'show'} contentList={comedy} />
        <p className="text-white">Reality</p>
        <Carousel type={'show'} contentList={reality} />
      </div>
    </div>
  )
}

export default TvShows
