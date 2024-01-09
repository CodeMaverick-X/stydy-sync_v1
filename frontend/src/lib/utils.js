// contains util functions

const ENDPOINT = 'http://localhost:5000'

// GROUP UTILS

/**
 * create group with name
 * @param name: name of group
 */
export const createGroup = async (name) => {
    try {
        const res = await fetch(`${ENDPOINT}/api/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(name),
        })

        if (res.ok) {
            const data = await res.json()
            return data
        }
    } catch (error) {
        console.log(`error: ${error}`)
    }
}

/**
 * join group
 * @param group_id: group id
 * @param user_id: user id
 */

export const joinGroup = async (group_id, user_id) => {
    try {
        const res = await fetch(`${ENDPOINT}/api/joingroup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 'user_id': user_id, 'group_id': group_id }),
        })

        const data = res.json()
        if (res.ok) {
            return data
        } else {
            console.log('could not join group')
        }

    } catch (error) {
        console.log(error)
    }
}

/**
 * get groups(array) from the database
 * 
 */

export const getGroups = async () => {
    try {
        const res = await fetch(`${ENDPOINT}/api/groups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        if (res.ok) {
            const data = await res.json()
            // console.log(data)
            // setLoading(false)
            // setGroups(data.groups)
            return data.groups
        }
    } catch (error) {
        console.log(error)

    }
}

//  Messages utils***********

/**
 * get messages from the group when you open the group
 * next set of messages will be done with websockets
 * @param group_id: group id 
 */
export const getMessages = async (group_id) => {
    try {
        const res = await fetch(`${ENDPOINT}/api/messages/${group_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })

        if (res.ok) {
            const data = await res.json()
            const messages = data.messages
            return messages
        }

    } catch (error) {
        console.log(error, 'from  messages')
    }
}

// Get group info {Side panel}

/**
 * 
 * @param {*} group_id: group id of the group 
 * @returns : returns the group info with members included
 */
export const getGroupInfo = async (group_id) => {
    try {
        const res = await fetch(`${ENDPOINT}/api/groupinfo/${group_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (res.ok) {
            const data = await res.json()
            const groupInfo = data.group_info
            return groupInfo
        }
    } catch (error) {
        console.log(error)
        
    }
}