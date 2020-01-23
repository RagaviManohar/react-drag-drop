import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const DragColumnList = [
    { type: 'todo', index: 1, fieldName: 'Todo' },
    { type: 'inProgress', index: 2, fieldName: 'In-Progress' },
    { type: 'testing', index: 3, fieldName: 'Testing' },
    { type: 'done', index: 4, fieldName: 'Done' },
]

const defaultItemList = [
    { id: 1, name: 'Story 1', type: 'todo' },
    { id: 3, name: 'Story 3', type: 'todo' },
    { id: 9, name: 'Story 9', type: 'todo' },
    { id: 2, name: 'Story 2', type: 'inProgress' },
    { id: 4, name: 'Story 4', type: 'inProgress' },
    { id: 6, name: 'Story 6', type: 'testing' },
    { id: 5, name: 'Story 5', type: 'testing' },
    { id: 7, name: 'Story 7', type: 'testing' },
    { id: 8, name: 'Story 8', type: 'done' },
]

const divStyle = {
    display: 'flex',
    'marginRight': '10px',
}

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    // assign the destination value to the element
    removed.type = droppableDestination.droppableId

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
})

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
})

class DragAndDrop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemList: defaultItemList,
            dragStartCardIndex: 0,
        }
    }

    getItemsListByType = (type) => {
        return this.state.itemList.filter(item => item.type === type)
    }

    onDragStart = (startDetails) => {
        const stageObjDetails = DragColumnList.find(stage => stage.type === startDetails.source.droppableId)
        this.setState({ dragStartCardIndex: stageObjDetails.index })
    }

    onDragEnd = result => {
        const { source, destination } = result

        // dropped outside the list
        if (!destination) {
            return
        }

        if (source.droppableId !== destination.droppableId) {
            move(
                this.getItemsListByType(source.droppableId),
                this.getItemsListByType(destination.droppableId),
                source,
                destination
            )
        }
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {

        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                <div style={divStyle}>
                    {DragColumnList.map((column, index) => {
                        /* Disable drag when drop column is not adjacent */
                        const dropDisabled = !(
                            column.index === this.state.dragStartCardIndex - 1
                            || column.index === this.state.dragStartCardIndex + 1
                        )
                        return (
                            <div key={index}>
                                <h4>{column.fieldName}</h4>
                                <Droppable
                                    droppableId={column.type}
                                    isDropDisabled={dropDisabled}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}
                                        >
                                            {this.getItemsListByType(column.type).map((item, index) => (
                                                <Draggable
                                                    key={index}
                                                    index={index}
                                                    draggableId={item.name}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>
                                                            {item.name}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>

            </DragDropContext>
        )
    }
}

export default DragAndDrop
