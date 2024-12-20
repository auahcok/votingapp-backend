// <!-- <!doctype html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Reset Your Password</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f6f6f6;
//       margin: 0;
//       padding: 0;
//     }

//     .container {
//       width: 100%;
//       max-width: 600px;
//       margin: 0 auto;
//       padding: 20px;
//       background-color: #ffffff;
//       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//     }

//     .header {
//       text-align: center;
//       padding: 20px 0;
//     }

//     .header h1 {
//       margin: 0;
//       color: #333333;
//     }

//     .content {
//       padding: 20px;
//     }

//     .content p {
//       margin: 0 0 10px;
//       color: #666666;
//     }

//     .content a {
//       display: inline-block;
//       padding: 10px 20px;
//       margin-top: 10px;
//       background-color: #007bff;
//       color: #ffffff;
//       text-decoration: none;
//       border-radius: 5px;
//     }

//     .footer {
//       text-align: center;
//       padding: 20px;
//       color: #999999;
//       font-size: 12px;
//     }
//   </style>
// </head>

// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Password Reset Request</h1>
//     </div>
//     <div class="content">
//       <p>Hello <%= userName %>,</p>
//       <p>
//         You requested to reset your password. Click the link below to reset
//         it:
//       </p>
//       <a href="<%= resetLink %>">Reset Password</a>
//       <p>
//         If you did not request a password reset, please ignore this email or
//         contact support if you have any questions.
//       </p>
//       <p>Thank you,<br />Fratezone Team</p>
//     </div>
//     <div class="footer">
//       <p>
//         &copy; <%= new Date().getFullYear() %> TypeScript Backend Toolkit. All
//         rights reserved.
//       </p>
//     </div>
//   </div>
// </body>

// </html> -->
// <!-- CHANGE TO ejs if want to use HTML -->
export const emailTemplates = {
  'reset-password': `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .header h1 {
          margin: 0;
          color: #333333;
        }
        .content {
          padding: 20px;
        }
        .content p {
          margin: 0 0 10px;
          color: #666666;
        }
        .content a {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 10px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #999999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello <%= userName %>,</p>
          <p>
            You requested to reset your password. Click the link below to reset
            it:
          </p>
          <a href="<%= resetLink %>">Reset Password</a>
          <p>
            If you did not request a password reset, please ignore this email or
            contact support if you have any questions.
          </p>
          <p>Thank you,<br />Fratezone Team</p>
        </div>
        <div class="footer">
          <p>
            &copy; <%= new Date().getFullYear() %> TypeScript Backend Toolkit. All
            rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
};
