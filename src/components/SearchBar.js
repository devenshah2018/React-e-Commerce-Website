//searchbar component

import React from 'react'
import { FormControl, Navbar } from 'react-bootstrap'
import { CartState } from '../context/CartContext';

const SearchBar = ({classes}) => {
    const { productFilterDispatch } = CartState();
    return (
    <>
        <script type='module' src='SiteAssistant.js'></script>
        <Navbar.Text className={`p-0 ${classes}`}>
            <FormControl
                placeholder='Search a product'
                className='m-auto'
                id='suno-search-target'
                onChange={e => {
                    console.log("Input changed:", e.target.value); // Log the value
                    productFilterDispatch({
                        type: 'FILTER_BY_SEARCH',
                        payload: e.target.value,
                    });
                }}
            />

        </Navbar.Text>
    </>
  )
}

export default SearchBar