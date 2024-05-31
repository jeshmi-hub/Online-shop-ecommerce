import React,{useContext, useState} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = state.productAPI.category
    const [sort, setSort] = state.productAPI.sort
    const [search,setSearch] = state.productAPI.search
    const handleCategory = e=>{
        setCategory(e.target.value)
        setSearch('')
    }
  return (
    <div className='filter_menu'>
        <div className='row'>
            <span>Filters:</span>
            <select name="category" value={category} onChange={handleCategory}>
                <option value=''>All Products</option>
                {
                    categories.map(category=>(
                        <option value={"category=" + category._id} key={category._id}>
                            {category.name}
                        </option>
                    ))

                }

            </select>
        </div>
         <input type='text' value={search} placeholder="Enter your search!" onChange={e=> setSearch(e.target.value)}/>
         <div className='row'>
            <span>Sort By:</span>
            <select value={sort} onChange={e=> setSort(e.target.value)}>
              <option value='sort=-sold'>Best sales</option>
              <option value='sort=-price'>Price: High-Low</option>
              <option value='sort=price'>Price: Low-High</option>

            </select>
        </div>
    </div>
  )
}

export default Filters
