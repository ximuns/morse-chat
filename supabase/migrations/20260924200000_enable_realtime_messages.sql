alter publication supabase_realtime
add table public.messages;

create policy "room members can receive messages"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.room_members
        where room_members.room_id = messages.room_id
        and room_members.identity_id = auth.uid()
        and room_members.left_at is null
    )
);