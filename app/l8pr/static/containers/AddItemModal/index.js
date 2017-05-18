import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { QuickAddShow } from '../../components'
import { connect } from 'react-redux'
import * as auth from '../../actions/auth'
import * as modal from '../../actions/modal'
import * as selectors from '../../selectors'
import { getDuration } from '../../utils'
import classNames from 'classnames'
import './style.scss'

function AddItemModal({ handleHide, shows, item, toggleItemToShow, saveItemAndCreateShow }) {
    return (
        <Modal show={true} onHide={handleHide}>
            <Modal.Header>
                <a className="close" onClick={handleHide}>
                    <i className="icon-close-small" />
                </a>
                <h3>Add the track to a show</h3>
            </Modal.Header>
            <Modal.Body>
                <QuickAddShow onSubmit={(title) => saveItemAndCreateShow({ title }, item )} />
                {shows.map((show) => {
                    let classes = classNames(
                        'AddItemModal__item',
                        { 'AddItemModal__item--contains-item': !!show.items.find((i) => i.id === item.id) }
                    )
                    return (
                        <div key={show.id} className={classes} onClick={() => toggleItemToShow(item, show)}>
                            <div className="AddItemModal__title">{show.title}</div>
                            <div className="AddItemModal__details">
                                <span>{show.items.length} tracks</span>
                                <span>{getDuration(show.items)}</span>
                            </div>
                        </div>
                    )
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
AddItemModal.propTypes = {
    shows: React.PropTypes.array.isRequired,
    item: React.PropTypes.object.isRequired,
    handleHide: React.PropTypes.func.isRequired,
    toggleItemToShow: React.PropTypes.func.isRequired,
    saveItemAndCreateShow: React.PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    shows: selectors.myShows(state),
    item: state.modal.modalProps.item,
})
export const saveItemAndUpdateState = (dispatch, item) => (
    dispatch(auth.saveItem(item))
    .then((item) => {
        dispatch(modal.showModal('ADD_ITEM', { item }))
        return item
    })
)
const mapDispatchToProps = (dispatch) => ({
    toggleItemToShow: (item, show) => (dispatch(auth.toggleItemToShow(item, show))),
    saveItemAndCreateShow: (show, item) => {
        saveItemAndUpdateState(dispatch, item)
        .then(item => (
            dispatch(auth.saveShow({
                ...show,
                items: [item],
            }))
        ))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(AddItemModal)
