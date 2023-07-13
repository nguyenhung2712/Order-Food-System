import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { styled } from "@mui/material";

const StyledItem = styled("div")(({ theme }) => ({
    backgroundColor: '#eee',
    borderRadius: 4,
    padding: '4px 8px',
    transition: 'background-color .8s ease-out',
    marginTop: 8,
    "&:hover": {
        backgroundColor: '#fff',
        transition: 'background-color .1s ease-in'
    },
}));

const Item = ({ text, index, isDisabled }) => {
    return (
        <Draggable draggableId={text.id} index={index} isDragDisabled={isDisabled}>
            {provided => (
                <StyledItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {text.name}
                </StyledItem>
            )}
        </Draggable>
    )
}

export default Item