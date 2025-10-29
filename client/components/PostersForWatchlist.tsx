import { NavHashLink } from 'react-router-hash-link'
import { getDetailById } from '../api/combinedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import {
  addToCompletedList,
  deleteFromCompletedList,
  deleteFromWatchlist,
} from '../api/dbApi'
import { WatchlistData } from '../models/models'

interface PostersForWatchlistProps {
  type: string
  id: number
  state: 'watchlist' | 'completed'
}

function PostersForWatchlist(props: PostersForWatchlistProps) {
  const { type, id, state } = props

  const mutateDeleteFromCompletedList = useMutation({
    mutationFn: async (item: WatchlistData) => {
      const token = await getAccessTokenSilently()
      await deleteFromCompletedList(item, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['completedChecker'])
    },
  })
  const mutateDeleteFromWatchList = useMutation({
    mutationFn: async (item: WatchlistData) => {
      const token = await getAccessTokenSilently()
      await deleteFromWatchlist(item, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlistChecker'])
    },
  })
  const addToCompletedListFromWatch = useMutation({
    mutationFn: async (item: WatchlistData) => {
      const token = await getAccessTokenSilently()
      await addToCompletedList(item, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlistChecker'])
    },
  })

  const { user, getAccessTokenSilently } = useAuth0()
  const auth0Id = user?.sub
  const tmdbPosterLink = `https://image.tmdb.org/t/p/w500/`

  const queryClient = useQueryClient()
  queryClient.invalidateQueries(['watchlistContent', 'completedChecker', id])
  useEffect(() => {
    // Invalidate relevant queries when type or id changes

    queryClient.invalidateQueries(['watchlistContent', 'completedChecker', id])
  }, [queryClient, id])

  async function getContentDetails() {
    const result = await getDetailById(type, id)
    return result
  }

  const {
    data: content,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['watchlistContent', 'watchlistChecker', 'completedChecker', id],
    queryFn: getContentDetails,
  })
  if (isLoading) return <h1>Loading...</h1>
  if (isError) {
    console.error(error)
    return null
  }

  function getReleaseYear() {
    if (content.release_date) {
      const result = content.release_date.split('-')[0]

      return result
    } else if (content.first_air_date) {
      const result = content.first_air_date.split('-')[0]

      return result
    } else return 'Release date unknown'
  }

  const toWatchList: WatchlistData = {
    content_id: content.id,
    movie_or_show: type,
    auth_id: auth0Id,
  }

  async function handleWatchListClickDelete() {
    if (state == 'watchlist') {
      mutateDeleteFromWatchList.mutate(toWatchList)
    } else if (state == 'completed') {
      mutateDeleteFromCompletedList.mutate(toWatchList)
      // await deleteFromCompletedList(toWatchList, token)
    }
    queryClient.invalidateQueries(['watchlistChecker', 'completedChecker', id])
  }

  async function handleGreenTickClick() {
    handleWatchListClickDelete()
    addToCompletedListFromWatch.mutate(toWatchList)
  }

  return (
    <div>
      <NavHashLink to={`/details/${type}/${content.id}#trailer`}>
        {!content.poster_path || content.poster_path == 'null' ? (
            <div className="relative">
              <img
                alt={content.title ? `${content.title}` : `${content.name}`}
                src="/client/images/blank-poster.jpg"
                className="w-52"
              ></img>
              <div className="text-white absolute top-1/4">
                <p>
                  {content.title ? `${content.title}` : `${content.name}`}
                </p>
                <p>{`${getReleaseYear()}`}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap">
              <img
                src={`${tmdbPosterLink}${content.poster_path}`}
                alt=""
                className="w-52 rounded"
              />
            </div>
          )
        }
      </NavHashLink>

      <div className="flex justify-between">
        <button
          onClick={handleWatchListClickDelete}
          className="text-[#be123c] text-center"
        >
          X
        </button>
        {state == 'watchlist' ? (
          <button
            onClick={handleGreenTickClick}
            className="text-[#12be43] text-center"
          >
            &#10004;
          </button>
        ) : null}
      </div>
      {/* <p>{`ID: ${content.id}`}</p> */}
    </div>
  )
}


export default PostersForWatchlist
