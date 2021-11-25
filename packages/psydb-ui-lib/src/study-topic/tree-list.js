import React, { useContext } from 'react';
import classnames from 'classnames';
import { Icons } from '@mpieva/psydb-ui-layout';

var ActionContext = React.createContext();

export const TreeList = (ps) => {
    var { onCreate, onEdit, onSelect, selectedTopicId, trees } = ps;

    return (
        <ActionContext.Provider value={{
            onCreate,
            onEdit,
            onSelect,
            selectedTopicId,
        }}>
            { trees.map((it, index) => (
                <Topic key={ index } { ...it } />
            ))}
        </ActionContext.Provider>
    )
}

const Topic = (ps) => {
    var {
        onCreate,
        onEdit,
        onSelect,
        selectedTopicId
    } = useContext(ActionContext);

    var { data: node, children, level = 0 } = ps;
    var { _id, _matchesQuery, state } = node;
    var { name, parentId } = state;

    var isSelected = (selectedTopicId === _id);
    
    //var Name = [0,1].includes(level) ? `h${4+level}` : 'div'
    var Name = level === 0 ? 'h5' : 'div'
    var InnerName = isSelected ? 'b' : 'span';

    var wrapperClassName = classnames([
        level === 0 ? 'mb-2' : 'ml-4'
    ]);
    var nameClassName = classnames([
        'd-inline-block pb-1',
        level === 0 && 'mt-2',
        _matchesQuery && 'text-primary',
    ]);


    return (
        <div className={ wrapperClassName }>
            <Name className='m-0'>
                <InnerName
                    className={ nameClassName }
                    role='button'
                    onClick={ () => onSelect && onSelect(_id) }
                >
                    { name }
                </InnerName>
                { isSelected && (
                    <>
                        { onCreate && (
                            <CreateButton onClick={ () => onCreate(node) } />
                        )}
                        { onEdit && (
                            <EditButton onClick={ () => onEdit(_id) } />
                        )}
                    </>
                )}
            </Name>
            <div
                className='ml-1 pl-1'
                style={{ borderLeft: '3px solid #ccc' }}
            >
                { children.map((it, index) => (
                    <Topic
                        key={ index } level={ level + 1 }
                        { ...it }
                    />
                ))}
            </div>
        </div>
    )
}

const CreateButton = (ps) => {
    var { onClick } = ps;
    return (
        <a
            className='btn btn-link p-0 m-0 border-0 ml-3 text-primary'
            style={{ verticalAlign: 'baseline' }}
            onClick={ onClick }
        >
            <Icons.Plus
                viewBox='4 4 10 10'
            />
        </a>
    )
}

const EditButton = (ps) => {
    var { onClick } = ps;
    return (
        <a
            className='btn btn-link p-0 m-0 border-0 ml-1 text-primary'
            style={{ verticalAlign: 'baseline' }}
            onClick={ onClick }
        >
            <Icons.PencilFill
                viewBox='0 0 18 18'
            />
        </a>
    )
}
