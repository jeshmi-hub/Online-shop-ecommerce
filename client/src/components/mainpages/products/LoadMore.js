import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'

function LoadMore() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.productAPI.page
    const [result] = state.productAPI.result
  return (
    <div className='load_more'>
        {
            result < page * 9 ? ""
            :<button onClick={()=> setPage(page+1)}>Load more</button>
        }   
      
    </div>
  )
}

export default LoadMore
