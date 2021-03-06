# Shad's 5D chess algebraic notation (5dpgn)

This is my take at an algebraic notation for [5D chess](https://5dchesswithmultiversetimetravel.com/).
Other, proposed notations include:

- [Axel's algebraic, a take on 5D chess notation](https://docs.google.com/document/d/1G456NzkPc_ZsAj3HBpdTZuTP3tP-g1k98GdoRE38E5A/view)
- [Matrix Notation](https://drive.google.com/drive/folders/10332r6crq_pD-d4pG4VSynM8ziu1uT98)
- [Hexicube's adaptation of Axel' AN](https://github.com/Hexicube/5D-Chess-Game-Viewer)
- [nidlatam's notation](https://github.com/nidlatam/my-5d-chess-notation)

This algebraic notation is meant to be an extension of [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) for 5D chess.

## Included converter

This repository includes a converter and previewer. For information on how to run it and use it, check [USAGE.md](USAGE.md).

## Vocabulary

- A **turn** is an alternation between white's sub-turn and black's sub-turn. Each player may only make moves during their (sub-)turn. This differs from a board **step**.
- A **move** happens when a player moves one of their pieces to a legal position. Moves that were not submitted with the submit button yet are referred to as **temporary moves**. We will only consider moves that were already submitted.
- A **board** is the state of the chess board at any point in time. Each time a player moves a piece, one or two new board(s) is/are created, with the new piece disposition(s).
- A **multiverse** or a **timeline** is an alternate version of one of the game's universe. A new multiverse is created when a piece from another dimension or from the future jumps to an already-played board. Each game starts with at least one multiverse.
- A **jump** is when a piece moves outside of its board; if it jumps to another board whose turn is the current player's turn, no new multiverse is created. Otherwise, a new multiverse is created containing the piece that jumped.
- A **step** is the unit of time between board states. It is made up of two **sub-steps**, each being a board in time.
- **Physical** coordinates and moves are coordinates and moves within a single board.
- **Super-physical** coordinates and moves are those that span across boards. Both time- and multiverse travels are super-physical moves or jumps.
- **Check** is a state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent can make one or more moves to get out of this situation.
- **Checkmate** is the state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent has no legal move.
- **Softmate** is the state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent may only travel back in time.

## Coordinates

Each tile in a board is numbered as per the classical chess notation (`a1` through `h8` on an 8 by 8 board).

Boards themselved are localized by their date (denoted in-game with `T1`, `T2`, ...) and their timeline (in-game: `L`, `1L`, `-1L`, `2L`, `-2L`).
Since players can only interact with boards belonging to their sub-turns, there is no need for us to differentiate between the two boards

Super-physical coordinates uses the following notation: `(L<a> T<b>)`, which can be shortened to `(<a>T<b>)`. Both should be considered valid by parsers, though the latter is the recommended form and will be used throughout this document.

`<a>` is the multiverse coordinate, it is an integer ranging from `-n` to `n`. `-0` and `0` are considered the same. Timelines created by the white player are given the next, unused positive integer; while timelines created by black are given the next, unused negative integer.
`<b>` is the time coordinate, it is an integer ranging from `1` to `n'`.

A standard game starts with one empty timeline on `L0`.
Using this notation, the first board of a standard game is reffered to as `(0T1)` or `(L0 T1)`.

Super-physical coordinates are written before the physical coordinates: `(-1T6)e4` is the square `e4` on the `(L-1 T6)` board.

## Moves

Physical moves are written the same as traditional chess [standard algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_%28chess%29).

They *must* be preceded by their board's coordinates if there is more than one timeline at the currently described state of the game.
If there is only one timeline up to this point, then physical moves may be written without their corresponding board's coordinate.

Piece letters are the same as standard algebraic notation, with `D` for the dragon, `U` for the unicorn and `P` for pawn.

The following informations about checks can be appended to the move:

- `+` if the move checks the opponent's king
- `*` if the move softmates the opponent's king (if it is a sequence of moves that achieve this, then the last one should have the softmate indicator)
- `#` if the move checkmates the opponent's king

### Jumps

Jumps use the following syntax:

- The super-physical coordinate of the origin board
- The piece's letter
- The piece's physical coordinate
- `>>` if the jump is branching, `>` if the jump isn't branching
- `x` if a piece is being taken
- The super-physical coordinate of the target board
- The physical coordinate of the target square
- `+`, `*` or `#` if the moves checks, softmates or checkmates the adversary
- `~` if the jump is branching and the present is being moved to the new branch

All put together, it looks like this: `(-1T4)Nc3>>x(0T2)c3+~` ("The knight from board -1L, T4, c3 jumps and takes on L, T2, c3, creating a new timeline (-2L) and moving the present").

A non-branching jump may look like this: `(0T6)Pd5>(1T6)d5`.

### Promotions

As of right now, underpromotion is not allowed/implemented yet.

Promotions can only occur in physical moves and are denoted by adding the `=` symbol at the end of the move (before `+` or `#`), optionally with the piece the pawn is promoted into (`Q`).

### Inactive timeline reactivation

Should a past, inactive timeline be reactivated, the following token may be put after a move:

`(~Tx)`, with `x` being replaced by the corresponding turn.

There is no need to precise which sub-turn it is, as the corresponding player will have to play on the now-activated board, unless another branching move is made.

### Complex scenarios

In complex scenarios, especially with inactive timelines being reactivated or created, it may become hard for humans to keep track of which timelines were created.
To aid this, one may put the following token after a move:

`(>Lx)`, with `x` being replaced by the new timeline's index.

A fully-detailled, complex move may thus look like this: `(-1T4)Nc3>>x(0T2)c3+ (>L2) (~T1)`

Both present movement and created timeline tokens are purely for better human comprehension and should match with what can be induced from the described state of the game (if the piece of notation needs to be parsed).

## Turns

During their turn, each player may make several moves. Each move is written next to each other, separated by one or more spaces.
Sub-turns are separated by a forward slash (`/`).

A turn's syntax is the following:

- `<x>.`, with `<x>` being the turn number (remember that this is different from the time coordinate of a board)
- White's moves
- `/`
- Black's moves

Such a turn looks like this:

```
1. (0T1)d4 / (0T1)d6
```

## Tags

This format's specific tags are the following:

- `Board`: which variation was chosen (`Standard`, `Simple - No Queens`, etc.)
- `Size`: the size of the board (`8x8`, `7x7`, `5x5`)
- `InitialMultiverses`: a list of space-separated, initial multiverses' indexes (`-0 +0 1`); defaults to `0`, unless the board is already known
- `Mode`: should always be set to `5D`

## Examples

### Rook Tactics I

```pgn
[Size "5x5"]
[Mode "5D"]

1. (0T1)Kb2 / (0T1)Ke4
2. (0T2)Re1 / (0T2)Kd3
3. (0T3)Re5# {attacks (0T1)Ke5}
```

### Knight tactics III

```pgn
[Size "5x5"]
[Mode "5D"]

1. (0T1)Nd2 / (0T1)c3
2. (0T2)Nb3 / (0T2)c2
3. (0T3)Nb3>>(0T1)a3 / (1T1)Ke4
4. (1T2)Nb5# {attacks (0T3)Kd5}
```

### Actual game

Following is an example of a game, encoded in the described standard:

```pgn
[White "Teln0"]
[Black "Shad Amethyst"]
[Board "Simple - No Queens"]
[Size "7x7"]
[Date "2020.08.14"]
[Result "1-0"]
[Mode "5D"]

1. (0T1)Nd3 / (0T1)Nc5
2. (0T2)Nxc5+ / (0T2)bxc5
3. (0T3)g3 / (0T3)g4
4. (0T4)Bg2 / (0T4)d5
5. (0T5)O-O {to the right} / (0T5)Be5
6. (0T6)Nb1>>(0T5)b3 / (1T5)Bb6
7. (1T6)Nc3 / (0T6)Ne7>(1T6)e5
8. (0T7)a4 (1T7)O-O {to the right} / (0T7)Be5>>(0T6)e4
9. (-1T7)Bxe4 / (-1T7)dxe4 (1T7)c4
10. (1T8)Nb3>(0T8)d3 (-1T8)a4 / (-1T8)Bd4 (0T8)Kd7>(1T8)d6
11. (-1T9)Ra3 (0T9)Ra3 (1T9)b3 / (-1T9)Bd4>x(0T9)d3 (1T9)cxb3
12. (-1T10)d3 (0T10)cxd3 (1T10)Ba3 / (-1T10)Nd5 (0T10)Rb7 (1T10)c5?
13. (-1T11)dxe4 (0T11)Rc3 (1T11)axb3 / (0T11)Rg5 (1T11)Ne5>x(-1T11)e4
14. (-1T12)Rd3 (0T12)d4 (1T12)b4 / (-1T12)c4 (0T12)c4 (1T12)cxb4
15. (-1T13)Rd4 (0T13)d3 (1T13)Ba4+ / (-1T13)O-O-O {to the left} (0T13)cxd3 (1T13)Bc5
16. (-1T14)Rxe4 (0T14)exd3 (1T14)Bxc5+ / (0T14)Bg2 (-1T14)Nd5>x(1T14)c5
17. (-1T15)Rc4 (0T15)Rc6 (1T15)Ra5 / (-1T15)e5 (0T15)Bd3+ (1T15)Ne4
18. (-1T16)Rb4+ (0T16)Kg1 (1T16)Nxe4 / (-1T16)Kb7>x(0T16)c6 (1T16)dxe4
19. (-1T17)Rb4>(1T17)b4 (0T17)Bxg5 / (-1T17)Bc4 (0T17)Bc4 (1T17)Nd5
20. (-1T18)Be3 (0T18)Rc1 (1T18)Rd4 / (-1T18)Rd7 (0T18)Kc6>(1T18)b6?
21. (-1T19)Bb6+ {checks (1T19)d6} (0T19)Rb1 (1T19)Raxd5+ / (-1T19)c6>(0T19)c6 {blocks (-1T20)Bb6>>x(1T20)d6 1-0} (1T19)exd5
22. (-1T20)Bb6>x(0T20)b7+ {checks (1T20)d7} (1T20)Rxd5+ / (-1T20)Bc4>>x(-1T18)a4
23. (-2T19)Bb6 / (-2T19)Rb7
24. (-2T20)Bb6>>x(-1T20)a6+ {checks (1T20)b6, (2T20)b6 also checks (1T19)b6} 1-0 {Black forfeits}
```

Here is what the end of that game looks like:

![End of the aforementionned game](https://cdn.discordapp.com/attachments/740361438375313540/743827989321744467/unknown.png)

## Notes

### Even-numbered starting boards

Originally, this notation planned to not number boards `-0` and `+0`.
There are some arguments for this:

- Under IEEE 754, [`-0 == 0`](https://en.wikipedia.org/wiki/Floating-point_arithmetic#Signed_zero)
- Internally in the game, `-0` is `-1`

Arguments for numbering boards using `-0` and `+0` are:

- The game shows you the board indices as such, making it easier to manually transcribe a game
- The displayed timeline index gives a hint about who has or hasn't branching priority
- It can be converted when parsed and later stored as `-0.5` and `+0.5`
- Axel's notation, Hexicube's parser and the Matrix notation already use `-0` and `+0`

Thus, this notation now allows using `-0` and `+0` as starting board indices.
Reluctants may still use `-1` and `0` by specifying it in the `InitialMultiverses` tag.

If `-0` and `+0` are used, the `+` sign is mandatory (just like how it's always displayed in such cases in the game).
The `+` sign can be omitted for other integers.

The included parser goes around the signed zero equality issue by converting during the token parsing phase `"-0"` to `-0.5` and `"+0"` to `0.5`.

### Branching

Branching notation (as in SAN) is not yet supported, and it is unknown how it should behave with the super-physical coordinates.
Possibilities include:

- Keeping parenthesis-enclosed super-physical coordinates and simply introducing branching (both are compatible as long as token priority is introduced)
- Having square bracket-enclosed super-physical coordinates and parenthesis-enclosed branches
- Having square bracket-enclosed super-physical coordinates *in* parenthesis-enclosed branches
- Remove the parentheses around super-physical coordinates, at the cost of readability

### Omission

As in SAN, parts of the source square's coordinates may be omitted.
While the parser bundled here could handle omission in super-physical moves, this format requires you to specify these coordinates nonetheless.

In some cases, moving a piece to an otherwise valid square is illegal because it would put the king in check.
In those cases, this piece can be considered pinned and may be left out of the equation when looking for omission.

Because checks in 5D chess aren't as trivial as in traditional chess (sometimes requiring a specific move order between boards), the source square's coordinates should still be specified.

Omission of super-physical coordinates is being considered.
