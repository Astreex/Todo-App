import { useState, useEffect, createContext, useContext, useMemo } from "react"
import TodoItem from "./interface/TodoItem"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete'
import { List, ListItem, IconButton, ListItemText, Container, Grid } from "@mui/material"
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { PaletteMode } from '@mui/material'
import { grey } from '@mui/material/colors'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import Box from '@mui/material/Box'

const ColorModeContext = createContext({ styledTodoApp: () => { } });

const TodoApp = () => {
    const [newTodo, setNewTodo] = useState('')
    const [todos, setTodos] = useState<TodoItem[]>([])

    const theme = useTheme()
    const colorMode = useContext(ColorModeContext)
    
    useEffect(() => {
        try {
            JSON.parse(localStorage.getItem('todos') || '[]') || []
        } catch (e) {
            console.log(e)
        }
    }, [])
    
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])



    const addTodo = () => {
        if (newTodo !== '') {
            const newTodoItem: TodoItem = {
                id: crypto.randomUUID(),
                text: newTodo,
                isCompleted: false,
            }
            setTodos([...todos, newTodoItem])
            setNewTodo('')

        }
    }

    document.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            addTodo()
        }
    })

    const removeTodo = (id: string) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    }

    const toggleComplete = (id: string) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, isCompleted: !todo.isCompleted }
            }
            return todo
        })
        setTodos(updatedTodos)
    }

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    position: 'absolute',
                    right: '55px',
                    width: '20px',
                    height: '20px',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    borderRadius: 1,
                }}>

                <IconButton sx={{
                    ml: 1,
                }}
                    onClick={colorMode.styledTodoApp} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>
            <Container maxWidth="md">
                <Grid textAlign="center">
                    <h1>TodoApp</h1>
                    <TextField
                        size="small"
                        autoFocus={true}
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <Button onClick={addTodo} sx={{ mt: '1px', ml: '2px', }}>New Todo</Button>
                </Grid>
                <List>

                    {todos.map((todo) => (
                        <ListItem
                            key={todo.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    aria-label="delete"
                                    onClick={() => removeTodo(todo.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                            <Checkbox checked={todo.isCompleted} onChange={() => toggleComplete(todo.id)} sx={{
                                color: 'inherit'
                            }} />
                            <ListItemText sx={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', wordBreak: 'break-all' }}>
                                {todo.text}
                            </ListItemText>

                        </ListItem>
                    ))}
                </List>
            </Container>
        </>
    )
}

export default function StyledTodoApp() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light')

    const getDesignTokens = (mode: PaletteMode) => ({
        palette: {
            mode,
            primary: {
                ...grey,
                ...(mode === 'dark' ? {
                    main: grey[50],
                } :
                    {
                        main: grey[900]
                    }),
            },
            ...(mode === 'dark' && {
                background: {
                    default: '#202020',
                    paper: '#202020'
                },
            }),
            text: {
                ...(mode === 'light'
                    ? {
                        primary: '#202020'
                    }
                    : {
                        primary: grey[50]
                    }),
            },
        },
    });
    const theme = createTheme(getDesignTokens(mode))

    const colorMode = useMemo(
        () => ({
            styledTodoApp: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            },
        }),
        [],
    )

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <TodoApp />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
