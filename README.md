# Discord Wheel Bot

A Discord bot that manages a spin-the-wheel list for random selection, built with TypeScript and discord.js.

**Invite Link:** https://discord.com/oauth2/authorize?client_id=1437176399373930618&permissions=2147503104&integration_type=0&scope=bot+applications.commands

## Table of Contents

- [Commands](#commands)
  - [Add](#add)
  - [List](#list)
  - [Spin](#spin)
  - [Reset](#reset)
  - [Remove](#remove)
  - [Shuffle](#shuffle)
- [Installation](#installation)
- [Creating Issues](#creating-issues)

## Commands

### `/add`

#### Description

Adds one or more items to the wheel. Items should be space-separated.

#### Usage

```
/add <items>
```

#### Parameters

- `<items>` — The items you want to add, separated by spaces.

#### Example

```
/add apple banana cherry
```

✅ _Adds `apple`, `banana`, and `cherry` to the wheel._

---

### `/list`

#### Description

Shows all current items currently on the wheel.

#### Usage

```
/list
```

🧾 _Displays all items with their corresponding index numbers._

---

### `/spin`

#### Description

Spins the wheel and randomly selects one item.
The selected item is **removed** from the list after spinning.

#### Usage

```
/spin
```

🎡 _Example Output:_

> 🎡 The Wheel has spoken. The chosen one is: **banana**.
> Remaining: apple, cherry

---

### `/reset`

#### Description

Resets the wheel, removing all items.

#### Usage

```
/reset
```

🔄 _Clears the wheel completely._

---

### `/remove`

#### Description

Removes a specific item from the wheel by name.

#### Usage

```
/remove <item>
```

#### Parameters

- `<item>` — The name of the item you want to remove.

#### Example

```
/remove banana
```

🗑️ _Removes `banana` from the wheel._

---

### `/shuffle`

#### Description

Shuffles all items in the wheel randomly.

#### Usage

```
/shuffle
```

🔀 _Reorders the items to randomize their positions._

## Installation

Clone the repository:

```bash
git clone https://github.com/CShatto99/discord-wheel-bot.git
# or
gh repo clone CShatto99/discord-wheel-bot
```

Install the dependencies:

```bash
npm install
```

In the root of the project, rename `.env.example` to `.env` and fill out the empty environment variables.

Run the development server:

```bash
npm run dev
```

## Creating Issues

If you encounter any bugs, issues, or have suggestions for improvement, feel free to create a new issue on this repository using [this link](https://github.com/CShatto99/discord-wheel-bot/issues/new).

When creating an issue, please include:

- The command you were using
- A short description of what happened
- (Optional) Console logs or screenshots

## License

This project is license under the [MIT License](https://opensource.org/license/mit).
