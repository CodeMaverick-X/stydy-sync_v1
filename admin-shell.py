#!/usr/bin/python3
import cmd

from prettytable import PrettyTable

from helpers.db_helpers import (create_user, delete_user, get_all_users,
                                get_user)


class Admin(cmd.Cmd):
    """provode a console to help with admin duties and development"""

    prompt = '(Stydysync): '
    intro = 'Commands: create_user, show [user_id], delete_user [user_id]'

    def do_create_user(self, data: str =None):
        """greet me muther fucker """
        username, email = data.split(' ')
        if username == None or username == '':
            print('enter valid username')
        elif email == None or email == '':
            print('enter valid email')
        else:
            id = create_user(username, email)
            print(f'User: {username} ID:{id} --- created')

    def help_create_user(self):
        print('USAGE: create_user username email')

    def do_show(self, user_id: int =None):
        """shows a user if user_id or show all users"""
        if user_id == '' or user_id == None:
            users = get_all_users()
            table = PrettyTable()
            table.field_names = ['USERNAME', 'EMAIL', 'ID']
            for user in users:
                table.add_row([user['username'], user['email'], user['id']])
            print(table)
        else:
            user = get_user(user_id)
            print(f'NAME: {user["username"]} EMAIL: {user["email"]} ID: {user["id"]}')

    def help_show(self):
        print('USAGE: show [user_id] {for specific user}, show {for all users}')

    def do_exit(self, fix_me: str):
        """exit program"""
        return True

    def do_quit(self, fix_me: str):
        """exit program"""
        return True

    def do_delete_user(self, id: int):
        """find the user with the id"""
        if id:
            delete_user(id)
            print('Hopefully deleted')
        else:
            print('enter valid id')

    def help_delete_user(self):
        print('USAGE: delete_user [user_id]')


if __name__ == '__main__':
    Admin().cmdloop()