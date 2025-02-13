import React from 'react';
import PropTypes from 'prop-types';
import * as Popover from '@radix-ui/react-popover';
import {
  LayoutIcon,
  CheckIcon,
  DragHandleDots2Icon,
} from '@radix-ui/react-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function WidgetManager({
  widgets,
  visibleWidgets,
  onToggleWidget,
  onReorderWidgets,
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    console.log('result :>> ', result);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    onReorderWidgets({
      sourceIndex,
      destinationIndex,
      draggableId: result.draggableId,
    });
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <LayoutIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Customize Dashboard</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-64 rounded-lg bg-gray-800 border border-white/10 shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          align="end"
          side="bottom"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Visible Widgets</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="widgets">
                {(provided) => (
                  <div
                    className="space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {widgets?.map((widget, index) => (
                      <Draggable
                        key={widget.id}
                        draggableId={widget.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <DragHandleDots2Icon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                {widget.label}
                              </span>
                            </div>
                            <button
                              onClick={() => onToggleWidget(widget.id)}
                              className={`w-4 h-4 rounded flex items-center justify-center ${
                                visibleWidgets.includes(widget.id)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white/5'
                              }`}
                            >
                              {visibleWidgets.includes(widget.id) && (
                                <CheckIcon className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <Popover.Arrow className="fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Define prop types
WidgetManager.propTypes = {
  className: PropTypes.string,
  widgets: PropTypes.array,
  visibleWidgets: PropTypes.array,
  onToggleWidget: PropTypes.func,
  onReorderWidgets: PropTypes.func,
};

export default WidgetManager;
