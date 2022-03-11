import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import cratersData from '../database/cratersData';
import '../styles/components/Modal.sass'

const Modal = () => {
  const { modal, setModal } = useContext(AppContext)

  const item = cratersData.filter(item => item.id === modal.itemId)

  const handleCloseModal = () => {
    setModal({
      open: false,
      itemId: ''
    })

    const labelRendererElement = document.querySelector('#app ~ div')

    labelRendererElement.style.position = "absolute"
  }

  if (!modal.open) return null

  return (
    <div className="Modal__Container">
      <div className="Modal__Card">
        <h2 className='Modal__Title'>{item[0].name}</h2>
        <img className='Modal__Image' src={item[0].image} alt={item[0].name} title={item[0].name}/>
        <p className='Modal__Price'>${item[0].price}K</p>
        <a className='Modal__Link' href="https://opensea.io/assets/0xd00e79629e2053d837285c74a0ec09f51b33c141/1635" target="_blank" rel="noreferrer">Go to Metaverse</a>

        <button className='Modal__Button-Close' onClick={handleCloseModal}>
          X
        </button>
      </div>
    </div>
  );
}

export default Modal;