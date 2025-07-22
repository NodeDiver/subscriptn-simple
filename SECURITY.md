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
Make sure these are properly set:
```bash
BTCPAY_HOST=https://your-btcpay-server.com
BTCPAY_API_KEY=your_secure_api_key
```

### Basic Security Checklist
- [ ] Changed default demo credentials
- [ ] Using HTTPS in production
- [ ] Environment variables properly configured
- [ ] Database file has secure permissions
- [ ] Dependencies are up to date

---

**Note**: This is a beginner project. For production use, consider implementing proper user registration, password hashing, and additional security measures. 