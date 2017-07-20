import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { LoginView } from '../index'

function LoginModal({ handleHide }) {
    var form = null
    function login() {
        form && form.login()
    }
    return (
        <Modal show={true} onHide={handleHide}>
            <Modal.Header>
                <a className="close" onClick={handleHide}>
                    <i className="icon-close-small" />
                </a>
                <h3>Login</h3>
            </Modal.Header>
            <Modal.Body>
                <LoginView ref={(r) => {if (r) form = r.getWrappedInstance()}}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleHide}>Close</Button>
                <Button type="submit" onClick={login}>Login</Button>
            </Modal.Footer>
        </Modal>
    )
}

LoginModal.propTypes = { handleHide: React.PropTypes.func.isRequired }

export default LoginModal
