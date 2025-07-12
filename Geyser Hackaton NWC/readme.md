# Pitch for the slides presentation of the NWC hackathon organized by Geyser (2025-07-09)

---

**Slide 1 – Introduction 👋**
Hello everyone! I'm Nodii, actively involved in my local Bitcoin community. I've been running a BTCPayServer for about a year and a half, helping Bitcoin entrepreneurs overcome barriers to accepting Bitcoin payments. Over this time, I've supported more than 15 businesses, with 5 currently active projects benefiting from my hosted BTCPayServer infrastructure.

**Slide 2 – Problem & Solution 🚀**
During this journey, I've noticed various recurring issues: shop owners are eager to accept Bitcoin payments, but they often struggle with managing the technical aspects or find that paying for an exclusive server is too costly. So, having one person host one server for many shop owners has been a good thing so far. However, subscription management is manual and cumbersome for the BTCPayServer admins. I have to contact each user (shop owner) every month and request a Lightning payment to help me cover the cost of hosting the BTCPayServer. This feels like a fee collector from the Middle Ages.
To address this, I created SubscriptN, a solution that will automate subscription payments through Nostr Wallet Connect (NWC). It seamlessly manages subscription statuses, limiting admin rights for unpaid shop owners while still allowing them view-only access, and automatically restoring privileges upon payment.

**Slide 3 – Progress & Roadmap 🛠️**
In just 6 days and roughly 35 hours of work, some progress has been made: I've built foundational subscription features, implemented a user database, set up basic API endpoints, implemented Alby libraries, and created documentation while making progress on the project. Unfortunately, I was not able to make the subscription work yet for today. I might need some more days to get this finally working. Moving forward, key next steps include finalizing NWC integration, enhancing the admin dashboard user experience, and rigorously addressing security aspects.

**Slide 4 – Learning Journey 📚**
SubscriptN started primarily as a learning journey. This hackathon is my very first experience presenting publicly. Once I get the core functionality working, which is the NWC subscription, I plan to incorporate feedback from valuable partners like ONG Bitcoin Chile; they too offer BTCPayServer services to entrepreneurs with shops accepting Bitcoin.
Though currently small, the community around this project will shape its growth. I want to be deeply cautious about security, especially being new to the space, before seeking broader adoption. For now, it serves my personal learning and will serve my own practical use; long-term goals will emerge naturally based on community feedback and collaboration.

**Slide 5 – Thank You & Contact 🙏**
Thank you all so much for your time and attention! I genuinely welcome your feedback, suggestions, and recommendations. I'd like to mention the main reason why I chose to do this project: I have seen so far lots of solutions for onboarding Lightning users and spenders... but I have not seen as much help for entrepreneurs wanting to build a Bitcoin business. I believe there's a lot of room to strengthen support and build Lightning tools for businesses. Let's bridge this gap together. You can reach out to me via my GitHub repository, email, or Nostr handle. Your insights are truly appreciated! 🌩️✨ 