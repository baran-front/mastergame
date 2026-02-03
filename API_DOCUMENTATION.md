# جدول API ها

BaseUrl: api.arvinvira.com
Tenant: learn

| نام تابع                                 | آدرس API                                                                               | متد HTTP |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| **Article APIs**                         |
| `getArticleCategories`                   | `/v1/blogcategories/client/categories/zerocounter/5`                                   | GET      |
| `getArticles`                            | `/v1/blogposts/client/searchsp`                                                        | POST     |
| `getArticleDetail`                       | `/v1/blogposts/{id}`                                                                   | GET      |
| **Auth APIs**                            |
| `sendOtp`                                | `/identity/send-code?phoneNumber={phoneNumber}`                                        | POST     |
| `sendCode`                               | `/tokens/token-by-codev2`                                                              | POST     |
| `getMe`                                  | `/v1/personal/profile`                                                                 | GET      |
| `editProfile`                            | `/v1/personal/profile`                                                                 | PUT      |
| `setRepresentative`                      | `/v1/personal/representative?request={request}`                                        | POST     |
| `getProfileDateByRepresentativeDateBrif` | `/v1/personal/profiledatebyrepresentativedatebrif?fromDate={fromDate}&Todate={toDate}` | POST     |
| `searchUserCards`                        | `/v1/usercards/search`                                                                 | POST     |
| **Wallet APIs**                          |
| `chargeWallet`                           | `/v1/payments/paymentwallet`                                                           | POST     |
| `getTransactionWalletHistory`            | `/v1/transactionwallet/mytransactionwallethistory`                                     | GET      |
| `withdrawWallet`                         | `/v1/transactionwallet`                                                                | POST     |
| `getTransactionWalletTotal`              | `/v1/transactionwallet/mytransactionwallettotal`                                       | GET      |
| **General APIs**                         |
| `getCategory`                            | `/v1/categories/client/by-type/{type}`                                                 | GET      |
| `getCategoryDetail`                      | `/v1/categories/{id}`                                                                  | GET      |
| `getFaqs`                                | `/v1/faqs/client/searchex`                                                             | POST     |
| `postContactUs`                          | `/v1/contactusmessages`                                                                | POST     |
| `getMenuLinksByGroup`                    | `/v1/menulinks/client/groupnames`                                                      | POST     |
| `getPageInfo`                            | `/v1/pages/client/pageinfo`                                                            | POST     |
| `postBookmark`                           | `/v1/bookmarks/client`                                                                 | POST     |
| `getBookmarks`                           | `/v1/bookmarks/client`                                                                 | GET      |
| `getComments`                            | `/v1/comments/client/search`                                                           | POST     |
| `postComment`                            | `/v1/comments`                                                                         | POST     |
| `fileUploader`                           | `/v1/fileuploader?folder=learn`                                                        | POST     |
| `getCmsContentByName`                    | `/cms/client/by-name/{name}`                                                           | GET      |
| **Product APIs**                         |
| `getProducts`                            | `/v1/products/client/search`                                                           | POST     |
| `getProductById`                         | `/v1/products/client/{id}`                                                             | GET      |
| `getProductWithRelatedByCategory`        | `/v1/products/client/withrelatedbycategory/{id}`                                       | GET      |
| `getBasket`                              | `/v1/baskets/client`                                                                   | GET      |
| `updateBasket`                           | `/v1/baskets/client`                                                                   | POST     |
| `searchOrders`                           | `/v1/orders/client/search`                                                             | POST     |
| `createOrderWithWallet`                  | `/v1/orders/orderwithwallet`                                                           | POST     |
| **Ticket APIs**                          |
| `createTicket`                           | `/v1/tickets/client`                                                                   | POST     |
| `searchTickets`                          | `/v1/tickets/client/search`                                                            | POST     |
| `getTicketDetail`                        | `/v1/tickets/client/{id}`                                                              | GET      |
| `sendTicketMessage`                      | `/v1/tickets/client/message`                                                           | POST     |
