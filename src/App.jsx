import React, { useReducer, useEffect, useState } from 'react'
import Card from './components/Card'
import Api from './services/Api'


function App() {
  const client_id = import.meta.env.VITE_CLIENT_ID;
  // const [sVal, setSval] = useState({
  //   query: "",
  //   order: 'relevance'
  // })
  // const [page, setPage] = useState(1);
  // const [search, setSearch] = useState(false);

  // const [imageArr, setImageArr] = useState([]);

  function reducer(state, action) {
    switch (action.type) {
      case "FETCH_START":
        return {
          ...state,
          loading: true
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          data: action.payload.results,
          isSearch: true
        };
        case "FETCH_FAIL":
        return {
          loading: false,
          page: 1,
          data: null,
          query: "",
          order: "relevance",
          isSearch : false
        };
      case "SEARCH":
        return {
          ...state,
          ...action.payload
        }
      case "PAGE NEXT":
        return {
          ...state,
          page: state.page + 1
        }

      case "PAGE PREV":
        return {
          ...state,
          page: state.page === 1 ? 1 : state.page - 1
        }
      case "PAGE SET":
        return {
          ...state,
          page: 1
        }
      case "IS SEARCHED" :
        return {
          ...state, 
          isSearch : true
        }
    }
  }

  const initialValue = {
    loading: false,
    page: 1,
    data: [],
    query: "",
    order: "relevance",
    isSearch: false
  }

  const [state, dispatch] = useReducer(reducer, initialValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch( {
      type : "SEARCH", 
      payload : {
        [name] : value
      }
    });
  }

  const fetchData = async () => {
    dispatch({type: "FETCH_START"});
    try {
      const res = await Api.get('', {
        params: {
          query: state.query,
          order: state.order,
          page: state.page,
          per_page: 20,
          client_id: client_id
        }
      })
      console.log(res.data);
      dispatch({
        type: "FETCH_SUCCESS", 
        payload : res.data
      })

    }
    catch (err) {
      console.error(err);
      console.log(res);
      dispatch({type: "FETCH_FAIL"});
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type: "PAGE SET"});
    fetchData();
  }
  useEffect(() => {
      if (state.query) {
        fetchData()
      }
  }, [state.page])


  return (
    <>
      {/* Heading Section */}
      <div className='flex flex-col justify-center items-center gap-6'>
        <div className='bg-red-800 border-2 border-red-500 p-3 rounded-lg w-full'>
          <h1 className='text-4xl text-center font-mono'>React Gallery App</h1>
        </div>

        {/* Searching section  */}
        <form className='flex justify-center gap-6  text-white'>
          <input type='text' placeholder='search image here'
            name='query'
            className='bg-red-200 p-4 w-72 text-black rounded-2xl text-lg '
            value={state.query}
            onChange={handleChange}
          />
          <div>
            <label >Order by</label>
            <select name='order' className='bg-red-700 p-2' onChange={handleChange}>
              <option value='relevance'>Relevance</option>
              <option value='latest'>Latest</option>
            </select>
          </div>
          <button type='submit'
            className='bg-red-700 text-white px-2 py-0  cursor-pointer hover:bg-red-800 text-lg rounded-2xl'
            onClick={handleSubmit}
          >Search</button>
        </form>

        {/* Results Section */}
        <ul className='flex gap-6 justify-center w-full flex-wrap m-2'>
          {state.data && state.data.map((i) => (
            <li key={i.id}>
              <Card src={i.urls.thumb} alt={i.alt_description} title={i.description} down={i.links.download} />
            </li>
          ))}
        </ul>

        {state.isSearch && <div className='flex gap-10 text-white mb-4'>
          <button className='bg-red-700 p-2 text-white cursor-pointer'
            onClick={() => {dispatch({type : "PAGE PREV"})}}
          >Previous</button>
          <p>Page No: {state.page} </p>
          <button className='bg-red-700 p-2 text-white cursor-pointer '
            onClick={() => {dispatch({type : "PAGE NEXT"})}}
          >Next</button>
        </div>}
      </div>
    </>
  )
}

export default App