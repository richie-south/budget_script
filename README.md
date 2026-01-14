# Budget Script

_README and most of /site is ai generated_

Budget Script is a domain-specific language (DSL) designed for live financial calculations. Inspired by Apple Math Notes, it allows you to define variables, track recurring expenses, and visualize your financial future directly within the editor.

---

## Syntax Basics

### Variables and Units

To define a variable, use the `=` operator. Budget Script currently supports numbers and custom suffixes (units). Suffixes can be any text (e.g., `usd`, `kr`, `points`).

```javascript
income = 5000usd
rent = 1200

```

### Recurrence

You can define recurring values by appending an interval suffix. This tells the engine how often an amount repeats.

- `/day`
- `/month`
- `/year`

```javascript
salary = 3500usd /month
coffee = 5usd /day

```

---

## Modifiers

Modifiers allow you to adjust recurring values for specific timeframes. This is useful for one-time bonuses or permanent raises.

| Keyword    | Description                                        | Example                       |
| ---------- | -------------------------------------------------- | ----------------------------- |
| **`in`**   | A one-time exception for a specific month or date. | `income = 11000 in oct`       |
| **`from`** | A permanent change starting from a specific date.  | `income = 6000 from jan 2027` |

**Specific Date Example:**

```javascript
bonus = 5000 /year
bonus = 7000 from 20 dec 2026

```

---

## Visualization and Output

Budget Script uses the `#` symbol to trigger editor-specific visualizations.

### Inline Calculation

Place a `#` after an expression to see the calculated result in the editor sidebar.

```javascript
net_income = income - expenses # 3800

```

### Progress Bars

Use `#progress [current] [target]` to render a visual bar showing how close you are to a goal.

```javascript
savings = 450
goal = 1000
#progress savings goal

```

### Pie Charts

Use `#pie` followed by values or variables. You can use the spread operator (`...`) to break down a total into its original components.

```javascript
rent = 1200
food = 400
util = 200
total_expenses = rent + food + util

#pie ...total_expenses 500

```

### Predictions

The `#predict` command generates a line graph forecasting your balance over time based on recurring values. It maps the interval of your variable (e.g., monthly) against a target goal.

```javascript
savings = 500 /month
savings = 1000 in dec
goal = 10000

#predict savings goal

```

---

## Implementation Examples

### Simple Monthly Budget

```javascript
income = 4000kr
rent = 1200
food = 600

leftover = income - rent - food
leftover # 2200

#progress leftover income

```
