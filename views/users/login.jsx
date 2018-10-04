const React = require('react');

class Login extends React.Component {

    render() {

        return(

            <html>
                <head/>
                <body>
                    <h1>LOG IN</h1>
                    <form method="POST" action="/login">
                        <div>
                            Username:
                            <input type="text" name="username" autoComplete="off" />
                        </div>
                        <div>
                            Password:
                            <input type="password" name="password" />
                        </div>
                        <input type="submit" value="Login" />
                    </form>
                </body>
            </html>
    )};
};

module.exports = Login;