# Wickr IO Proxy Bot

The Wickr IO Proxy Bot allows a user or a group of users to interact with an asset outside of their network without exposing their usernames or emails to that asset.

To get started, you would need to setup your system, download and install Docker and run the WickrIO Docker container. Full instructions on how to do so are available here: https://wickrinc.github.io/wickrio-docs/#wickr-io-getting-started

**Usage:**

The first time using the proxy-bot will go something like the following:

* Add yourself as a user of the proxy bot with the /add command entering your username and alias
* Add the asset with whom you'd like to communicate with the /asset command entering the username of the alias
* (Optional) Add any other additional users that you would like to be able to send and receive messages from the asset
* (Optional) Create a room where all messages to and from the asset will go with the /create command

To get a list of commands available with the BroadcastBot, the /help command will present the list of the commands and a description of what each one does. The following is a list of the commands supported by the BroadcastBot, the commands in bold can only be used by approved Wickr users:

Command        | Description
---------------|-------------
**/add** | Add a user with an alias to the list of users who will send and receive messages from the asset
**/asset** | Add the asset that users of the Proxy Bot will communicate with
**/create** | Create a room with all the users that have been added and where all messages from the asset will go
**/list** | List the users of the Proxy Bot and their Aliases
**/remove** | Remove a user from the list so they will no longer be able to send or recieve messages from the asset
**/admin&nbsp;list** | Returns a list of the admin users.
**/admin&nbsp;add&nbsp;&lt;users&gt;** | Add one or more admin users. A message will be sent to all admin users identifying the new admin user.
**/admin&nbsp;remove&nbsp;&lt;users&gt;** | Remove one or more admin users. A message will be sent to all admin users identifying the removed admin user.
**/help** | Returns a list of commands and information on how to interact with the Proxy Bot

## Configuration:

Wickr IO integrations are configured by running the configure.sh file,

Required tokens:

- WICKRIO_BOT_NAME
- WHITELISTED_USERS - Comma-separated list of wickr users that will be allowed to use the bot
- DATABASE_ENCRYPTION_KEY - Choose a 16-character(minimum) string key to derive the crypto key from in order to encrypt and decrypt the user database of this bot. This must be specified, there is no default. NOTE: be careful not to change if reconfiguring the bot or else the user database won't be accessible.
