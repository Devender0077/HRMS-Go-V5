# Field Editor - Keyboard Shortcuts & Features

## ⌨️ Keyboard Shortcuts

### **Movement (Select field first)**
| Shortcut | Action | Notes |
|----------|--------|-------|
| `↑` Arrow Up | Move field up 1% | Precise positioning |
| `↓` Arrow Down | Move field down 1% | Can move to 95% (bottom) |
| `←` Arrow Left | Move field left 1% | |
| `→` Arrow Right | Move field right 1% | |
| `Shift + ↑↓←→` | Move 5% | Fast mode (5x faster) |

### **Copy/Paste/Duplicate**
| Shortcut | Action | Notes |
|----------|--------|-------|
| `Ctrl/Cmd + C` | Copy selected field | Shows "Field copied" in console |
| `Ctrl/Cmd + V` | Paste field | Creates copy with +5% offset |
| `Ctrl/Cmd + D` | Duplicate field | Same as copy+paste |

### **Delete**
| Shortcut | Action |
|----------|--------|
| `Delete` | Delete selected field |
| `Backspace` | Delete selected field |

---

## 🖱️ Mouse Interactions

### **Adding Fields**
1. Drag field type from left palette
2. Drop anywhere on PDF
3. Field appears with default size

### **Repositioning Fields**
1. Click and hold field
2. Drag to new position
3. **Auto-scroll**: Drag near top/bottom edge → PDF scrolls!
4. Release to drop

### **Resizing Fields**
When field is selected, you'll see 6 white circle handles:

```
○ ────── ○
│        │
│  FIELD │ ○ (east)
│        │
○ ────── ○
    ○ (south)
```

- **Corner handles** (4): Resize both width and height
  - nw (northwest): Top-left
  - ne (northeast): Top-right
  - sw (southwest): Bottom-left
  - se (southeast): Bottom-right

- **Edge handles** (2): Resize one dimension
  - e (east): Right edge - resize width only
  - s (south): Bottom edge - resize height only

### **Selecting Fields**
- Click field to select
- Click empty space to deselect
- Selected field shows solid border + resize handles
- Unselected fields show dashed border

---

## 🔍 Auto-Detect Fields

### **How It Works**
1. Click "Auto-Detect Fields" button (top of left palette)
2. System adds 13 common form fields automatically
3. Smart positioning based on field type
4. No duplicates (checks existing fields)

### **Detected Fields (13 Total)**

**Name Fields (Top 20-25%):**
- employee_name (Full Name)
- print_name (Print Name)

**Contact Fields (Middle 35-45%):**
- email (Email Address)
- phone (Phone Number)
- address (Physical Address)

**Bank Fields (Middle 55-60%):**
- routing_number (Routing Number)
- account_number (Account Number)

**Signature Fields (Bottom 82-85%):**
- employee_signature (Employee Signature)
- account_holder_signature (Account Holder Signature)

**Date Fields (Bottom 82-85%, Right side):**
- date_signed (Date)
- signature_date (Signature Date)

**Other:**
- agree_to_terms (Checkbox, 70%)
- initials (Initials, 88% bottom-right)

### **Smart Positioning**
- Signatures at bottom (where they belong)
- Dates next to signatures (right side)
- Bank fields in middle
- Contact info at top
- No overlaps
- Staggered for clarity

---

## 🎯 Workflow Examples

### **Quick Setup (30 seconds)**
```
1. Upload PDF template
2. Click "Auto-Detect Fields"
3. 13 fields added automatically!
4. Adjust positions if needed (drag or arrow keys)
5. Save
6. Done!
```

### **Manual Placement**
```
1. Drag "Signature" from palette
2. Drop at bottom of PDF
3. Drag near bottom edge → Auto-scrolls down
4. Use arrow keys for fine-tuning
5. Repeat for other fields
6. Save
```

### **Copy & Adjust**
```
1. Create first field manually
2. Position and size it perfectly
3. Ctrl/Cmd+C to copy
4. Ctrl/Cmd+V to paste (creates offset copy)
5. Adjust position with arrow keys
6. Repeat for similar fields
7. Save
```

### **Precise Alignment (Your ACH Form)**
```
GOAL: Place signature field at actual signature line

METHOD 1 (Drag):
1. Drag signature field from palette
2. Drag down towards bottom
3. When near bottom → PDF auto-scrolls
4. Continue dragging to signature line
5. Drop at ~85% Y position

METHOD 2 (Keyboard):
1. Add signature field anywhere
2. Click to select it
3. Hold Shift + Press ↓ multiple times
4. Field quickly moves to bottom
5. Use ↓ without Shift for pixel-perfect adjustment
6. Check Y% in properties panel → Should be ~85%

METHOD 3 (Properties):
1. Add signature field
2. Click to select
3. Right panel → Y%: 85
4. Field jumps to exact position!
```

---

## 🐛 Troubleshooting

### **Can't drag field to bottom?**
- ✅ Fixed! Auto-scroll now works
- Drag field near bottom edge (within 50px)
- PDF will scroll down automatically
- Keep dragging to continue moving field

### **Keyboard shortcuts not working?**
- Ensure field is selected (click it first)
- Click somewhere on the PDF canvas (not a text input)
- Shortcuts only work when field editor has focus

### **Auto-detect adds wrong fields?**
- Delete unwanted fields (select + Delete key)
- Manually add specific fields from palette
- Customize field names in properties panel

### **Fields overlap?**
- Drag to separate them
- Or use arrow keys for precise movement
- Or edit X%, Y% manually

---

## 💡 Pro Tips

1. **Fast Field Placement:**
   - Auto-detect first → Adjust later
   - Faster than manual placement

2. **Precision Alignment:**
   - Drag for rough position
   - Arrow keys for fine-tuning
   - Edit numbers for exact placement

3. **Duplicate Similar Fields:**
   - Create and position one field perfectly
   - Ctrl/Cmd+D to duplicate
   - Adjust position slightly
   - Faster than creating each from scratch

4. **Use Shift for Speed:**
   - Shift + Arrow keys = 5% movement
   - Without Shift = 1% movement
   - Combine for efficient positioning

5. **Resize Visually:**
   - Select field
   - Drag corner handle for proportional resize
   - Drag edge handle for one-dimension resize
   - Or edit Width%/Height% for exact size

---

## ✅ Feature Checklist

**Core Features:**
- [x] Drag from palette to add fields
- [x] Drag fields to reposition (with auto-scroll)
- [x] Resize fields with visual handles (6 per field)
- [x] Edit position/size with numbers
- [x] Auto-detect 13 common form fields
- [x] Multi-page PDF support
- [x] Field list sidebar
- [x] Properties panel
- [x] Color-coded field types

**Keyboard Shortcuts:**
- [x] Arrow keys to move (1% or 5% with Shift)
- [x] Copy/Paste fields (Ctrl/Cmd+C/V)
- [x] Duplicate fields (Ctrl/Cmd+D)
- [x] Delete fields (Delete/Backspace)

**Mouse Interactions:**
- [x] Click to select
- [x] Drag to move
- [x] Drag handles to resize
- [x] Auto-scroll when dragging near edges

**Smart Features:**
- [x] Auto-detect common form patterns
- [x] Deduplication (no duplicate field names)
- [x] Smart positioning by category
- [x] Bank form support (routing, account)
- [x] Signature positioning at bottom
- [x] Bounds constraints (can't go outside PDF)

---

**Perfect for your ACH Direct Deposit form!** ✅

