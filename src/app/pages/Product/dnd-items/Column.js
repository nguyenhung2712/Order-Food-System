import React from "react";
import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";
import { styled, TextField } from "@mui/material";
import { Paragraph } from "../../../components/Typography";

const StyledColumn = styled("div")(({ theme }) => ({
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    marginTop: 4,
    "& h2": {
        margin: 0,
        padding: "0 16px"
    },
    height: "100%"
}));

const StyledList = styled("div")(({ theme }) => ({
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    paddingTop: "4px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: 4,
    height: "200px",
    maxHeight: "200px", overflow: 'auto'
}));

const Column = ({ col: { list, id, name }, filterText, onSetFilterText, isDisabled }) => {
    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <StyledColumn>
                    <Paragraph>{name}</Paragraph>
                    <StyledList {...provided.droppableProps} ref={provided.innerRef}>
                        {list.map((text, index) => (
                            <Item key={text.id} text={text} index={index} isDisabled={isDisabled} />
                        ))}
                        {provided.placeholder}
                    </StyledList>
                    {
                        id !== "current" &&
                        <TextField
                            label="Tìm kiếm"
                            size="small"
                            sx={{
                                margin: "12px 14px 0 0",
                                width: "95%",
                            }}
                            value={filterText}
                            onChange={(event) => onSetFilterText(event.target.value)}
                        />
                    }

                </StyledColumn>
            )}
        </Droppable>
    )
}

export default Column