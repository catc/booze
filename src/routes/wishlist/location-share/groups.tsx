import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

@observer
class ProductGroup extends Component<GroupProps, {}> {
    @action select = () => {
        this.props.selectGroup(this.props.id)
    }

    render() {
        const { group, selected, id } = this.props
        return (
            <li onClick={this.select} className={`wishlist-location-groups__item ${selected === id ? 'state_selected' : ''}`}>
                {group.map(name => (
                    <span key={name} className="overflow-ellipsis">{name}</span>
                ))}
            </li>
        )
    }
}
interface GroupProps {
    group: string[];
    selectGroup: (groupKey: string) => void;
    id: string; // product group string key
    selected: string;
}

function ProductGroupList({ list, selectGroup, selected }: ListProps) {
    return (
        <>
            <p className="wishlist-location-groups__info">
                There wasn't a store found that contains all the selected products, but some
                of products do share the same store. Select a group of products to find common stores.
            </p>
            <ul className="wishlist-location-groups">
                {Object.keys(list).map((key) => {
                    const group = list[key]
                    return <ProductGroup
                        key={key}
                        id={key}
                        group={group}
                        selectGroup={selectGroup}
                        selected={selected}
                    />
                })}
            </ul>
        </>
    )
}

export default ProductGroupList

export interface ListProps {
    list: { [groupStr: string]: string[] };
    selectGroup: (groupKey: string) => void;
    selected: string;
}