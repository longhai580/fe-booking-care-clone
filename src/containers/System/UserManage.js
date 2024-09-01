import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import {getAllUsers, createNewUserService, deleteUserService, editUserService} from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

import { Alert } from 'reactstrap';
import {emitter} from '../../utils/emitter';
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          arrUsers: [],
          isOpenModalUser: false,
          isOpenModalEditUser: false,
          userEdit: {}
        }
    }
  
  async componentDidMount() {
    await this.getAllUserFromReact();
    }
    
    getAllUserFromReact = async() => {
      let response = await getAllUsers('ALL');
      if(response && response.errCode === 0){
          this.setState({
              arrUsers: response.users
          },() =>{
              console.log('Check state: ',this.state.arrUsers);
          })
          console.log('Check state: ',this.state.arrUsers);

      }
      
    }  
  
    handleAddNewUser = () => {
        this.setState({
          isOpenModalUser: true
        })
    }
  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser
    })
    }
  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser
    })
  }

  createNewUser = async (data) => { 
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage)
      } else {
        await this.getAllUserFromReact();
        this.setState({
          isOpenModalUser: false
        })
        emitter.emit('EVENT_CLEAR_MODAL_DATA')
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  handleDeleteUser = async(user) => {
    try {
      let res = await deleteUserService(user.id);
      if (res && res.errCode === 0) { 
        await this.getAllUserFromReact();
      } else {
        alert(res.errMessage)
      }
    }catch (e){
      console.log(e);
    }
    console.log('Checke  user delet',user);
  }
  handleEditUser = async(user)=>{
    console.log('check edit user', user)
    this.setState({
      isOpenModalEditUser: true,
      userEdit : user
    })
  }

  doEditUser = async (user) => {
    try {
      let res = await editUserService(user)
      if (res && res.errCode === 0) { 
        this.setState({
          isOpenModalEditUser: false
        })
        await this.getAllUserFromReact();

      }else {
        alert(res.errMessage)
      }
      
    } catch(e) {
      console.log(e);
    }
  }

    render() {
        let arrUsers = this.state.arrUsers;
      return (
        <div className='user-container mt-5 mx-5'>
          <ModalUser
            isOpen={this.state.isOpenModalUser}
            toggleFromParent={this.toggleUserModal}
            createNewUser = {this.createNewUser}

          />
          {this.state.isOpenModalEditUser &&
          
           <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            editUser = {this.doEditUser}
            currentUser={this.state.userEdit}

          />
          }
            <div className="title text-center">Manage users</div>
            <div clasName="mx-1">
              <button
                className="btn btn-primary px-3"
                onClick= {()=>{this.handleAddNewUser()}}
              ><i className="fas fa-plus"></i> Add new user</button>
            </div>
            <div className='user-table'>
            <table id="customers">
              <tbody>
               <tr>
                <th>ID</th>
                <th>Email</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>

                {
                  arrUsers && arrUsers.map((item, index) => {
                    return (
                      <tr>
                        <td>{item.id}</td>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.address}</td>
                        <td>
                          <button className="btn-edit" onClick= {()=>{this.handleEditUser(item)}}><i className="far fa-edit"></i></button>
                          <button className="btn-delete" onClick={() => { this.handleDeleteUser(item) }}><i className="fas fa-trash-alt"></i></button>
                        </td>

                      </tr>
                    )

                  })
                }
              </tbody>
              </table>
            </div>
        </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
