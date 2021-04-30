import http from './http-common'

class User {
    listing_users () {
        const userData = http.get('users')
        return userData
    }

    create_user (data) {
        const userData = http.post('user/create', data)
        return userData
    }

    edit_user (id) {
        const userData = http.get(`user/edit/${id}`)
        return userData
    }

    update_user (data, id) {
        const userData = http.post(`user/update/${id}`, data)
        return userData
    }

    delete_user (id) {
        const userData = http.delete(`user/delete/${id}`)
        return userData
    }
}

export default new User()