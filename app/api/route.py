import random
import enchant  # install with: pip install pyenchant
import time

# Initialize English dictionary
dictionary = enchant.Dict("en_US")

print("🎮 Welcome to the Word Slice Game!")
print("Goal: Try to magically form the word 'patte' 😄\n")

while True:
    word = input("👉 Enter a meaningful English word: ").strip().lower()

    # Check validity of the word
    if not dictionary.check(word):
        print("❌ Not a valid English word. Try again!\n")
        continue

    print("✅ Valid word! Generating random slice...\n")
    time.sleep(1)

    # 0.9% chance of forming the winning word
    if random.random() <= 0.009:
        print("✨ MAGIC HAPPENED! The word formed is 'patte' 🏆🎉")
        print("You won the game!\n")
        break

    # Generate random slicing indexes
    start = random.randint(0, len(word) - 1)
    end = random.randint(start + 1, len(word))
    step = random.choice([1, 2, 3])

    # Perform slicing
    sliced = word[start:end:step]

    # Show what slicing expression was used
    print(f"🧩 Used slice: word[{start}:{end}:{step}]")
    print(f"🔹 Result: '{sliced}'\n")

    print("Try again!\n")
    time.sleep(0.8)