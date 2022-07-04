import React, { useState, useRef } from 'react'
import gsap from 'gsap'
import '../styles/components/Sort.sass'

const Sort = ({ sortArray }) => {
  const [ showOptions, setShowOptions ] = useState(false)
  const arrowRef = useRef(null)

  const handleShowOptions = () => {
    if(showOptions) {
      setShowOptions(false)
      gsap.to(arrowRef.current, { rotateX: '+=180' })
    } else {
      setShowOptions(true)
      gsap.to(arrowRef.current, { rotateX: '+=180' })
    }
  }

  const handleSortValue = (value) => {
    sortArray(value)
    setShowOptions(false)
  }

  return (
    <div className="Sort">
      <button className="Sort__Button" onClick={handleShowOptions}>
        Sort By
        <img className='Sort__Button-Icon' src='./bluemoon/assets/arrow.svg' ref={arrowRef}/>
      </button>
      {showOptions && (
        <div className="Sort__Items-Container">
          <button className='Sort__Item' onClick={() => handleSortValue('date')}>Date</button>
          <button className='Sort__Item' onClick={() => handleSortValue('price')}>Price</button>
          <button className='Sort__Item' onClick={() => handleSortValue('name')}>A - Z</button>
          <button className='Sort__Item' onClick={() => handleSortValue('name-invert')}>Z - A</button>
          <button className='Sort__Item' onClick={() => handleSortValue('date')}>Most recent</button>
          <button className='Sort__Item' onClick={() => handleSortValue('price')}>Most popular</button>
        </div>
      )}
    </div>
  )
}

export default Sort