import React, { use, useEffect, useState } from 'react'
import Card from './components/Card'
import Api from './services/Api'


function App() {
  const client_id = import.meta.env.VITE_CLIENT_ID;
  const [sVal, setSval] = useState({
    query: "",
    order: 'relevance'
  })
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);

  const [imageArr, setImageArr] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSval((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchData = async () => {
    try {
      const res = await Api.get('', {
        params: {
          query: sVal.query,
          order: sVal.order,
          page: page,
          per_page: 20,
          client_id: client_id
        }
      })
      console.log(res.data);
      setImageArr(res.data.results);
      setSearch(true);
    }
    catch (err) {
      console.error(err);
      console.log(res);
      setSearch(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(true);
  }
  useEffect(() => {
    if (search) {
      fetchData()
    }
  }, [page, search])


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
            value={sVal.query}
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
          {imageArr.map((i) => (
            <li key={i.id}>
              <Card src={i.urls.thumb} alt={i.alt_description} title={i.description} down={i.links.download} />
            </li>
          ))}
        </ul>

        {search && <div className='flex gap-10 text-white mb-4'>
          <button className='bg-red-700 p-2 text-white cursor-pointer'
            onClick={() => {
              setPage((prev) => prev === 1 ? 1 : prev - 1);

            }}
          >Previous</button>
          <p>Page No: {page} </p>
          <button className='bg-red-700 p-2 text-white cursor-pointer '
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >Next</button>
        </div>}
      </div>
    </>
  )
}

export default App