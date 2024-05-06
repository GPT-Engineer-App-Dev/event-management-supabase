import React, { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, VStack, Text, useToast, IconButton, CloseButton, Heading } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const supabaseUrl = "https://dsmnnnvbvapoyacvfuqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbW5ubnZidmFwb3lhY3ZmdXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5ODcwNTgsImV4cCI6MjAzMDU2MzA1OH0.JBn3ieDfquvB44M9yB6va1bQFz6DxjOqCw-eAQO-rwA";

const fetchHeaders = {
  "Content-Type": "application/json",
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
};

const Index = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/events`, {
      headers: fetchHeaders,
      method: "GET",
    });
    const data = await response.json();
    setEvents(data);
  };

  const handleAddEvent = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/events`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({ name: eventName }),
    });
    if (response.ok) {
      fetchEvents();
      setEventName("");
      toast({
        title: "Event added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditEvent = async (id) => {
    const response = await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${id}`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({ name: eventName }),
    });
    if (response.ok) {
      fetchEvents();
      setEditingId(null);
      setEventName("");
      toast({
        title: "Event updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEvent = async (id) => {
    const response = await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${id}`, {
      method: "DELETE",
      headers: fetchHeaders,
    });
    if (response.ok) {
      fetchEvents();
      toast({
        title: "Event deleted.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Event Management App</Heading>
      <FormControl>
        <FormLabel>Event Name</FormLabel>
        <Flex>
          <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Enter event name" />
          <Button ml={2} onClick={editingId ? () => handleEditEvent(editingId) : handleAddEvent} colorScheme="blue">
            {editingId ? <FaEdit /> : <FaPlus />}
          </Button>
        </Flex>
      </FormControl>
      <VStack mt={4} spacing={4}>
        {events.map((event) => (
          <Flex key={event.id} align="center" justify="space-between" p={3} w="100%" borderWidth="1px" borderRadius="lg">
            <Text>{event.name}</Text>
            <Box>
              <IconButton
                icon={<FaEdit />}
                onClick={() => {
                  setEditingId(event.id);
                  setEventName(event.name);
                }}
                colorScheme="yellow"
                aria-label="Edit event"
                mr={2}
              />
              <IconButton icon={<FaTrash />} onClick={() => handleDeleteEvent(event.id)} colorScheme="red" aria-label="Delete event" />
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
