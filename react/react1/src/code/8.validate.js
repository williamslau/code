import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// cnpm install prop-types属性校验的包
import PropTypes from 'prop-types'
class Person extends Component {
    static propTypes = {            // 挂载静态属性 Person.propTypes = {}
        name: PropTypes.string.isRequired,   //isRequired必填
        age: PropTypes.number,
        gender: PropTypes.oneOf(['man', 'woman']),    // 选一，其中一个
        hobby: PropTypes.array,
        salary: function (props, key, com) {             // 自定义校验
            if (props[key] < 10000) {
                throw new Error(`${com} error ${props[key]} is too low`)
            }
        },
        position: PropTypes.shape({         // 校验对象
            x: PropTypes.number,
            y: PropTypes.number
        })
    }
    constructor(props) {
        super();
    }
    // 类组件的属性会挂载到this.props上
    render() {
        let { name, age, gender, hobby, salary, position } = this.props;
        return (<React.Fragment>
            {name}
            {age}
            {gender}
            {hobby}
            {salary}
            {JSON.stringify(position)}
        </React.Fragment>
        )
    }
}
let penson = {
    name: 'william',
    age: 18,
    gender: 'man',
    hobby: ['sleeping'],
    salary: 10000,
    position: {
        x: 1000,
        y: 1000
    }
}
render(<Person  {...penson} />, window.root);