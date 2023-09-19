import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectorRef,
  EnvironmentInjector,
  runInInjectionContext,
  EffectRef,
} from '@angular/core';

const pokemonBaseUrl =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// Writable signals
const todos = signal([
  { id: 1, title: 'Buy groceries', completed: true },
  { id: 2, title: 'Do laundry', completed: true },
  { id: 3, title: 'Walk the dog', completed: false },
]); // List of todos

@Component({
  selector: 'app-signals',
  standalone: true,
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsComponent {
  injector = inject(EnvironmentInjector);
  effectSig!: EffectRef;

  // Counter with Old style
  // counter = 1;
  // private cdr = inject(ChangeDetectorRef);

  // Counter with Signal
  counter = signal(0);

  readonly min = 1;
  readonly max = 100;
  currentPokemonId = signal(1);

  // Writable signals
  todos = signal([
    { id: 1, title: 'Buy groceries', completed: true },
    { id: 2, title: 'Do laundry', completed: false },
    { id: 3, title: 'Walk the dog', completed: true },
  ]); // List of todos
  showCompleted = signal(false); // Flag indicating whether completed todos should be shown

  ngOnInit() {
    // Counter with Old style
    // setTimeout(() => {
    //   this.counter = 2;
    //   this.cdr.markForCheck();
    // }, 3000);

    // Counter with Signal
    setTimeout(() => this.counter.set(1), 300);

    // Update the showCompleted flag
    this.showCompleted.set(true);

    // Update the values of the writable signals
    this.todos.mutate((value) => {
      value.push({ id: 4, title: 'Clean the house', completed: false });
      value[1].completed = false;
    });

    if (this.todos().length === 4) {
      this.loadToDoEffect();
    }
  }

  // Computed signal to filter and sort todos based on the showCompleted flag
  filteredTodos = computed(() => {
    const filtered = this.todos().filter(
      (todo) => this.showCompleted() || !todo.completed
    );
    return filtered.sort((a, b) => a.id - b.id);
  });

  // Computed signal to count the number of remaining todos
  remainingTodosCount = computed(() =>
    this.todos().reduce(
      (count, todo) => (todo.completed ? count : count + 1),
      0
    )
  );

  imageUrls = computed(() => ({
    previous: `${pokemonBaseUrl}/shiny/${this.currentPokemonId()}.png`,
    next: `${pokemonBaseUrl}/back/shiny/${this.currentPokemonId()}.png`,
  }));

  updateCounter(): void {
    this.counter.update((counter) => (counter += 1));
  }

  updatePokemonId(delta: number) {
    this.currentPokemonId.update((pokemonId) => {
      const newId = pokemonId + delta;
      return Math.min(Math.max(this.min, newId), this.max);
    });
  }

  loadToDoEffect() {
    // Error: NG0203: effect() can only be used within an injection context such as a constructor, a factory function, a field initializer, or a function used with `runInInjectionContext`. Find more at https://angular.io/errors/NG0203
    runInInjectionContext(
      this.injector,
      () =>
        // Effect to log the filtered todos and remaining count whenever they change
        (this.effectSig = effect(() => {
          console.log('Filtered Todos:');
          console.table(this.filteredTodos());
          console.log(`Remaining Todos: ${this.remainingTodosCount()}`);
        }))
    );
  }
}
