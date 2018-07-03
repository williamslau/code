import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions/cart'
class CartList extends Component {
    constructor() {
        super();
    }
    handleChange = (e) => {
        let id = Number(e.target.getAttribute('data-id'));
        this.props.changeCheck(id);
    }
    handleRemove = (e) => {
        let id = Number(e.target.getAttribute('data-id'));
        this.props.removeCart(id);
    }
    render() {
        return (<table className="table table-bordered">
            <thead>
                <tr>
                    <th>全选 非全选</th>
                    <th>商品名称</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {this.props.carts.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                data-id={item.id}
                                onChange={this.handleChange}
                            />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.count}</td>
                        <td>{item.price}</td>
                        <td>
                            <button data-id={item.id} onClick={this.handleRemove}>删除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>)
    }
}
export default connect((state) => ({
    carts: state.cart
}), actions)(CartList);