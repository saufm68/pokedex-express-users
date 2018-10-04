const React = require('react');

class Register extends React.Component {

    render() {

        return(

            <html>
                <head/>
                <body>
                    <h1>REGISTER</h1>
                    <form method="POST" action="/register">
                        <div>
                            Username:
                            <input type="text" name="username" autoComplete="off" />
                        </div>
                        <div>
                            Password:
                            <input type="password" name="password" />
                        </div>
                        <input type="submit" value="Register" />
                    </form>
                </body>
            </html>
    )};
};

module.exports = Register;