"use client"
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Importa el backend HTML5
import { useDrag, useDrop } from 'react-dnd';
import Link from 'next/link';
import '../../../../style/styles.css';
import React from 'react';

const ItemType = 'LIST_STUDENT_CONTENT';

const DraggableItem = ({ children, id, index, moveItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ cursor: 'move' }}>
      {children}
    </div>
  );
};

const EditRute = () => {
  const [items, setItems] = useState([1, 2]);

  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='edit-route-Call'>
        <div>
          <Link href={'/role/registerDriver/screendriver'}>
            <img src='https://cdn-icons-png.flaticon.com/512/6927/6927467.png' className='back-button' />
          </Link>
        </div>
        <h1 className='Title-page'>Editar ruta</h1>

        {items.map((item, index) => (
          <DraggableItem key={index} id={index} index={index} moveItem={moveItem}>
            <div className='list-student-content'>
              <div className='list-student'>
                <img src='https://cdn-icons-png.flaticon.com/512/5294/5294731.png' className='icon-nino-profile'/>
                <div className='list-student-info'>
                  <p>nombre: nombre de alumno </p>
                  <p>colegio: Colegio</p>
                </div>
              </div>
            </div>
          </DraggableItem>
        ))}
      </div>
    </DndProvider>
  );
};

export default EditRute;