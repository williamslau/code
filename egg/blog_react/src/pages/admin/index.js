import React, {Component} from 'react';

import {Row, Col} from 'antd';
import {Route} from 'react-router-dom';
import Header from '../../components/Header';
import Navleft from '../../components/Navleft';
import Welcome from '../welcome';
import Category from '../category';
import Classify from '../classify';
import Article from '../article';
import addArticle from '../addArticle';

export default class Admin extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Row className="admin-page">
                <Col span="24">
                    <Header/>
                </Col>
                <Col span="24">
                    <Row>
                        <Col span="3">
                            <Navleft/>
                        </Col>
                        <Col span="21">
                            <Route exact path="/admin" component={Welcome}/>
                            <Route path="/admin/article" component={Article}/>
                            <Route path="/admin/classify" component={Classify}/>
                            <Route path="/admin/category" component={Category}/>
                            <Route path="/admin/addArticle" component={addArticle}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}