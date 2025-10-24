import { useQuery } from '@tanstack/react-query'
import { getRecomendationsById } from '../api/combinedApi'
import Carousel from './Carousel'

interface Props {
  type: string
  id: number
}

function Recommendations(props: Props) {
  const { type, id } = props

  const {
    data: details,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['recomendations', type, id],
    queryFn: () => getRecomendationsById(type, id),
  })
  if (isLoading) return <h1>Loading...</h1>
  if (isError) {
    console.error(error)
    return null
  }

  const results = details?.results ?? []

  return (
    <div>
      <div>
        <h3 className="text-white text-center font-extrabold">
          Recomendations
        </h3>
        <div className="flex gap-1 rounded">
          <Carousel type={type} contentList={results} />

          {/* {details.results.map((content) => (
            <Posters type={type} key={content.id} content={content} />
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default Recommendations
