# Security

## 🚨 Reporting Security Issues

If you find a security vulnerability in SubscriptN, please report it privately:

**Email**: [nodediver@proton.me](mailto:nodediver@proton.me)

**Please include:**
- Description of the issue
- Steps to reproduce
- Potential impact

**Do not** create a public GitHub issue for security concerns.

## 🔒 Security Recommendations for Deployment

### Essential Security Steps
1. **Change default credentials** - Update demo username/password
2. **Use HTTPS** - Always in production
3. **Secure environment variables** - Never commit `.env` files
4. **Database security** - Ensure proper file permissions on `subscriptn.db`
5. **Regular updates** - Keep dependencies updated

### Environment Variables
This application uses environment variables for sensitive configuration. Copy `env.example` to `.env.local` and fill in your actual values:

```bash
cp env.example .env.local
```

**Required variables:**
- `BTCPAY_HOST`: Your BTCPay Server URL
- `BTCPAY_API_KEY`: Your BTCPay Server API key

### Database Security
- The SQLite database (`subscriptn.db`) contains sensitive user data and is automatically excluded from Git
- Never commit the database file or any `.env` files
- Use environment variables for all secrets and API keys

### Development Security
- Demo credentials are hardcoded for development only
- In production, implement proper user registration and password hashing
- Use HTTPS in production environments
- Implement proper session management and CSRF protection

### Basic Security Checklist
- [ ] Changed default demo credentials
- [ ] Using HTTPS in production
- [ ] Environment variables properly configured
- [ ] Database file has secure permissions
- [ ] Dependencies are up to date

---

**Note**: This is a beginner project. For production use, consider implementing proper user registration, password hashing, and additional security measures. 