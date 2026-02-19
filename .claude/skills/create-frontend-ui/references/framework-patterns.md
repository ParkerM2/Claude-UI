<overview>
Production-grade code patterns for React, Svelte, React Native, and Tailwind CSS. These ensure the distinctive UI is also performant and maintainable.
</overview>

<react_patterns>
**Critical Rules:**

**State Management:**
```tsx
// ✅ DO: Derive values from state, don't store them
const total = items.reduce((sum, item) => sum + item.price, 0);

// ❌ DON'T: Store derivable values
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce(...)), [items]);
```

**Effects:**
```tsx
// ✅ DO: Clean up effects
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// ✅ DO: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId included

// ❌ DON'T: Empty deps with external references
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId
```

**Performance:**
```tsx
// ✅ DO: Memoize expensive calculations
const filtered = useMemo(
  () => items.filter(expensiveFilter),
  [items]
);

// ✅ DO: Use useCallback for handlers passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ DO: Virtualize long lists (100+ items)
import { FixedSizeList } from 'react-window';
<FixedSizeList height={400} itemCount={items.length} itemSize={50}>
  {({ index, style }) => <Item style={style} data={items[index]} />}
</FixedSizeList>
```

**Accessibility:**
```tsx
// ✅ DO: Semantic HTML
<button onClick={handleClick}>Submit</button>

// ❌ DON'T: Div with onClick
<div onClick={handleClick}>Submit</div>

// ✅ DO: Label form controls
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ DO: Focus management in modals
useEffect(() => {
  if (isOpen) {
    firstInputRef.current?.focus();
  }
}, [isOpen]);
```

**TypeScript:**
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  children
}) => { ... };
```
</react_patterns>

<svelte_patterns>
**Critical Rules:**

**Reactivity (Svelte 4):**
```svelte
<!-- ✅ DO: Trigger reactivity with assignment -->
<script>
  let items = [];

  function addItem(item) {
    items = [...items, item]; // Reassign to trigger update
  }
</script>

<!-- ❌ DON'T: Mutate without reassignment -->
<script>
  function addItem(item) {
    items.push(item); // Won't trigger update!
  }
</script>
```

**Reactivity (Svelte 5 Runes):**
```svelte
<script>
  // ✅ DO: Use $state for reactive values
  let count = $state(0);

  // ✅ DO: Use $derived for computed values
  let doubled = $derived(count * 2);

  // ✅ DO: Use $effect for side effects
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

**Stores:**
```svelte
<script>
  import { writable, derived } from 'svelte/store';

  // ✅ DO: Use $ prefix for auto-subscription
  $: value = $myStore;

  // ❌ DON'T: Manual subscription without cleanup
  myStore.subscribe(v => value = v);
</script>
```

**Lifecycle:**
```svelte
<script>
  import { onMount } from 'svelte';

  // ✅ DO: Return cleanup from onMount
  onMount(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  });
</script>
```

**Lists:**
```svelte
<!-- ✅ DO: Always use keyed each -->
{#each items as item (item.id)}
  <Item {item} />
{/each}

<!-- ❌ DON'T: Index as key -->
{#each items as item, i (i)}
  <Item {item} />
{/each}
```
</svelte_patterns>

<react_native_patterns>
**Critical Rules:**

**Styling:**
```tsx
// ✅ DO: Use StyleSheet.create
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }
});

<View style={styles.container} />

// ❌ DON'T: Inline style objects
<View style={{ flex: 1, padding: 16 }} />
```

**Lists:**
```tsx
// ✅ DO: FlatList for long lists
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  getItemLayout={(_, index) => ({
    length: 50,
    offset: 50 * index,
    index
  })}
/>

// ❌ DON'T: ScrollView with map for 50+ items
<ScrollView>
  {items.map(item => <Item key={item.id} />)}
</ScrollView>
```

**Touch:**
```tsx
// ✅ DO: Use Pressable with hitSlop
<Pressable
  onPress={handlePress}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
>
  <Icon name="close" />
</Pressable>
```

**Images:**
```tsx
// ✅ DO: Specify dimensions for remote images
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>

// ✅ DO: Use expo-image for caching
import { Image } from 'expo-image';
<Image source={uri} cachePolicy="memory-disk" />
```

**Keyboard:**
```tsx
// ✅ DO: Handle keyboard visibility
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <TextInput keyboardType="email-address" />
</KeyboardAvoidingView>
```

**Accessibility:**
```tsx
// ✅ DO: Add accessibility labels
<Pressable
  accessibilityLabel="Submit form"
  accessibilityRole="button"
  onPress={handleSubmit}
>
  <Text>Submit</Text>
</Pressable>
```
</react_native_patterns>

<tailwind_patterns>
**Critical Rules:**

**Animation:**
```html
<!-- ✅ DO: Use Tailwind animate utilities -->
<div class="animate-pulse">Loading...</div>

<!-- ✅ DO: Appropriate transition duration -->
<button class="transition-colors duration-200 hover:bg-blue-600">
  Click
</button>

<!-- ❌ DON'T: duration-1000+ for UI elements -->
<button class="transition-all duration-1000">Slow</button>

<!-- ✅ DO: Respect reduced motion -->
<div class="motion-reduce:animate-none animate-bounce">
  Icon
</div>
```

**Z-Index:**
```html
<!-- ✅ DO: Use Tailwind z-* scale -->
<nav class="fixed top-0 z-50">...</nav>
<div class="z-40">Dropdown</div>

<!-- ❌ DON'T: Arbitrary z-index -->
<nav class="z-[9999]">...</nav>
```

**Focus States:**
```html
<!-- ✅ DO: Visible focus rings -->
<button class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click
</button>

<!-- ✅ DO: Use focus-visible for keyboard only -->
<button class="focus-visible:ring-2 focus-visible:ring-blue-500">
  Click
</button>

<!-- ❌ DON'T: Remove focus without replacement -->
<button class="focus:outline-none">Click</button>
```

**Touch Targets:**
```html
<!-- ✅ DO: 44px minimum touch targets on mobile -->
<button class="min-h-[44px] min-w-[44px] p-3">
  <Icon />
</button>

<!-- ❌ DON'T: Tiny buttons on mobile -->
<button class="h-6 w-6">
  <Icon />
</button>
```

**Screen Reader:**
```html
<!-- ✅ DO: SR-only labels for icon buttons -->
<button>
  <span class="sr-only">Close menu</span>
  <XIcon class="size-6" />
</button>
```

**Dark Mode:**
```html
<!-- ✅ DO: Support dark mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

**Images:**
```html
<!-- ✅ DO: Explicit dimensions on SVGs -->
<svg class="size-6" width="24" height="24">...</svg>

<!-- ✅ DO: Aspect ratio and object-fit -->
<div class="aspect-video">
  <img class="object-cover w-full h-full" loading="lazy" />
</div>
```

**New Tailwind v4 Syntax:**
```html
<!-- ✅ DO: Use size-* for square dimensions -->
<div class="size-6">...</div>  <!-- Instead of h-6 w-6 -->

<!-- ✅ DO: Use shrink-0 shorthand -->
<div class="shrink-0">...</div>  <!-- Instead of flex-shrink-0 -->

<!-- ✅ DO: Use bg-linear-to-* for gradients (v4) -->
<div class="bg-linear-to-r from-blue-500 to-purple-500">...</div>
```
</tailwind_patterns>

<performance_checklist>
**Before Shipping:**

- [ ] Images have explicit width/height (prevent CLS)
- [ ] Below-fold images use `loading="lazy"`
- [ ] Long lists (100+) are virtualized
- [ ] Animations use `transform` and `opacity` only
- [ ] `prefers-reduced-motion` is respected
- [ ] Touch targets are 44x44px minimum
- [ ] Focus states are visible
- [ ] Error boundaries wrap major sections
- [ ] Forms validate on blur
- [ ] Loading states show for operations >300ms
</performance_checklist>
