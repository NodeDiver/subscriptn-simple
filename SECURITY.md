# Security

## 🚨 Reporting Security Issues

If you find a security vulnerability in Bitinfrashop, please report it privately:

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
4. **Database security** - Ensure proper file permissions on `bitinfrashop.db`
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
- PostgreSQL database contains sensitive user data
- Use secure connection strings with proper authentication
- Never commit database credentials or any `.env` files
- Use environment variables for all secrets and API keys
- Implement proper backup and recovery procedures

### Production Security
- ✅ **Password Hashing**: Implemented with bcrypt
- ✅ **Session Management**: Secure session-based authentication
- ✅ **Input Validation**: Comprehensive sanitization and validation
- ✅ **Rate Limiting**: API endpoint protection
- ✅ **Encryption**: AES-256-GCM for NWC secrets
- ✅ **HTTPS**: Required for production deployments

### Production Security Checklist
- [ ] Using HTTPS in production
- [ ] Environment variables properly configured
- [ ] PostgreSQL database with secure credentials
- [ ] Database backups configured
- [ ] NWC encryption key properly set (32-char hex)
- [ ] Session secret configured
- [ ] Dependencies are up to date
- [ ] Rate limiting enabled
- [ ] Regular security audits scheduled

---

**Note**: Bitinfrashop is production-ready with enterprise-grade security measures including password hashing, input validation, rate limiting, and encryption. For questions or security concerns, contact nodediver@proton.me. 